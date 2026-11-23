import type { PointExchangeItem, PointGoodsItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Image, Text, View } from "@tarojs/components"
import { Gift } from "lucide-react-taro"
import { useState } from "react"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Scroll from "@/components/common/scroll"
import Alert from "@/components/modal/alert"
import Dialog from "@/components/modal/dialog"
import { usePointShop } from "@/pages/point/hooks/shop"
import { GOODS_LABEL, goodsStateOf, timeOf } from "@/pages/point/model/point"

/** 商品封面, 空地址或加载失败时用图标占位 */
function Cover({ src }: Readonly<{ src: string }>): ReactNode {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <View className="flex h-6h w-6h shrink-0 items-center justify-center rounded-md bg-default">
        <Icon icon={Gift} color="primary" className="h-3h w-3h" />
      </View>
    )
  }

  return (
    <Image
      src={src}
      mode="aspectFill"
      className="h-6h w-6h shrink-0 rounded-md bg-default"
      onError={() => setFailed(true)}
    />
  )
}

/** 一件待领取 */
function Exchange({ item }: Readonly<{ item: PointExchangeItem }>): ReactNode {
  return (
    <Card className="flex flex-col gap-1 border border-default p-3">
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-sm text-strong">{item.goodsName}</Text>
        <Text className="shrink-0 text-sm text-primary">{item.code}</Text>
      </View>
      <Text className="text-xs text-soft">{`兑换于 ${timeOf(item.createdAt)}`}</Text>
    </Card>
  )
}

/** 一件商品 */
function Goods({ item, value, onSelect }: Readonly<{
  item: PointGoodsItem
  value: number
  onSelect: (item: PointGoodsItem) => void
}>): ReactNode {
  const state = goodsStateOf(item, value)

  return (
    <Card className="flex items-center gap-3 border border-default p-3">
      <Cover src={item.cover} />

      <View className="flex flex-1 flex-col gap-1">
        <View className="flex items-center gap-2">
          <Text className="flex-1 text-sm text-strong">{item.name}</Text>
          <Text className="shrink-0 text-sm text-strong">{`${item.price} 积分`}</Text>
        </View>
        {item.description && <Text className="text-xs text-soft">{item.description}</Text>}
        <View className="flex items-center gap-2">
          <Text className="flex-1 text-xs text-soft">
            {item.count > 0
              ? `库存 ${item.count}`
              : "缺货"}
          </Text>
          <Button
            variant={state === "available"
              ? "solid"
              : "outline"}
            color={state === "available"
              ? "primary"
              : "ink"}
            className="shrink-0 rounded-full px-2 py-1 text-xs"
            disabled={state !== "available"}
            onClick={() => onSelect(item)}
          >
            <Text>{GOODS_LABEL[state]}</Text>
          </Button>
        </View>
      </View>
    </Card>
  )
}

export interface ShopProps {
  /** 当前积分 */
  value: number
}

/** 积分商城 */
export default function Shop({ value }: Readonly<ShopProps>): ReactNode {
  const { goods, exchanges, loading, exchanging, refreshing, refresh, exchange } = usePointShop()
  const [selected, setSelected] = useState<PointGoodsItem | null>(null)
  const [result, setResult] = useState<PointExchangeItem | null>(null)

  async function confirm(): Promise<void> {
    if (!selected || exchanging)
      return

    const item = await exchange(selected.id).catch(() => null)

    if (!item)
      return

    setSelected(null)
    setResult(item)
  }

  return (
    <>
      <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
        <View className="flex flex-col gap-2 pb-1r">
          {exchanges.length > 0 && (
            <>
              <Text className="px-1 text-xs text-soft">待领取</Text>
              {exchanges.map(item => <Exchange key={item.id} item={item} />)}
            </>
          )}

          <Text className="px-1 text-xs text-soft">积分好物</Text>
          {loading && goods.length === 0 && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
          {!loading && goods.length === 0 && (
            <Text className="py-8r text-center text-sm text-soft">暂无可兑换商品</Text>
          )}
          {goods.map(item => (
            <Goods key={item.id} item={item} value={value} onSelect={setSelected} />
          ))}
        </View>
      </Scroll>

      <Alert
        visible={selected !== null}
        title="确认兑换"
        confirmText="兑换"
        cancelText="取消"
        onCancel={() => setSelected(null)}
        onConfirm={() => void confirm()}
      >
        <Text className="text-sm text-soft">
          {selected
            ? `将消耗 ${selected.price} 积分, 当前库存 ${selected.count} 件`
            : ""}
        </Text>
      </Alert>

      <Dialog
        visible={result !== null}
        title="兑换成功"
        onClose={() => setResult(null)}
        footer={(
          <Button className="flex-1 py-1" onClick={() => setResult(null)}>
            <Text>知道了</Text>
          </Button>
        )}
      >
        {result && (
          <View className="flex flex-col gap-1">
            <Text className="text-sm text-strong">{result.goodsName}</Text>
            <Text className="text-sm text-primary">{`兑换码 ${result.code}`}</Text>
            <Text className="text-xs text-soft">请到学生活动中心领取</Text>
          </View>
        )}
      </Dialog>
    </>
  )
}
