import type { BaseEventOrig, PickerViewProps } from "@tarojs/components"
import type { ReactNode } from "react"
import type { ColumnLink, ColumnValue, PickerColumn } from "@/components/form/picker/types"
import { PickerView, PickerViewColumn, Text, View } from "@tarojs/components"
import { useEffect, useRef, useState } from "react"
import Button from "@/components/common/button"
import { applyLinks, clampDependent, clampValue, indicesOf, initialValueOf, optionsOf } from "@/components/form/picker/utils"
import Popup from "@/components/modal/popup"

export interface PickerPopupProps {
  /** 显隐 */
  visible: boolean
  /** 标题 */
  title?: string
  /** 列 */
  columns: readonly PickerColumn[]
  /** 当前值 */
  value: ColumnValue | null
  /** 列联动 */
  links?: readonly ColumnLink[]
  /** 自定义修正 */
  normalize?: (value: ColumnValue, changed: string) => ColumnValue
  /** 确认 */
  onConfirm: (value: ColumnValue) => void
  /** 关闭 */
  onClose: () => void
}

/** 选择弹层 */
export default function PickerPopup({
  visible,
  title = "请选择",
  columns,
  value,
  links = [],
  normalize,
  onConfirm,
  onClose,
}: Readonly<PickerPopupProps>): ReactNode {
  const [draft, setDraft] = useState<ColumnValue>(() => initialValueOf(columns, value))
  const wasVisibleRef = useRef(false)

  useEffect(() => {
    if (visible && !wasVisibleRef.current)
      setDraft(initialValueOf(columns, value))

    wasVisibleRef.current = visible
  }, [columns, value, visible])

  function handleChange(event: BaseEventOrig<PickerViewProps.onChangeEventDetail>): void {
    const indices = event.detail.value
    const previous = indicesOf(columns, draft)
    const changedIndex = indices.findIndex((index, indexOfColumn) => index !== previous[indexOfColumn])

    if (changedIndex < 0)
      return

    const changedColumn = columns[changedIndex]
    const options = optionsOf(changedColumn, draft)
    const option = options[Math.min(Math.max(indices[changedIndex] ?? 0, 0), options.length - 1)]

    if (!option)
      return

    let next: ColumnValue = {
      ...draft,
      [changedColumn.key]: option.value,
    }

    next = clampDependent(columns, next, draft, previous)
    next = applyLinks(next, links, changedColumn.key)
    next = normalize
      ? normalize(next, changedColumn.key)
      : next

    setDraft(clampValue(columns, next))
  }

  return (
    <Popup visible={visible} title={title} onClose={onClose} className="p-1r">
      <View className="flex flex-col gap-2">
        <PickerView
          value={indicesOf(columns, draft)}
          onChange={handleChange}
          indicatorStyle="height: 40px;"
          style={{ height: "200px" }}
          className="w-full"
        >
          {columns.map(column => (
            <PickerViewColumn key={column.key} style={{ width: column.width }}>
              {optionsOf(column, draft).map(option => (
                <View key={option.value} className="flex h-5h items-center justify-center">
                  <Text className="text-sm text-default">{option.label}</Text>
                </View>
              ))}
            </PickerViewColumn>
          ))}
        </PickerView>

        <View className="flex gap-2">
          <Button variant="outline" color="ink" className="flex-1 py-1" onClick={onClose}>
            <Text>取消</Text>
          </Button>
          <Button className="flex-1 py-1" onClick={() => onConfirm(draft)}>
            <Text>确定</Text>
          </Button>
        </View>
      </View>
    </Popup>
  )
}
