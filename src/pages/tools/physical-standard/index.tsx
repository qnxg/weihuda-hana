import type { ReactNode } from "react"
import type { Gender, GradeGroup, StandardProjectId } from "@/pages/tools/physical-standard/model/standard"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Choice from "@/pages/tools/physical-standard/components/choice"
import Score from "@/pages/tools/physical-standard/components/score"
import Summary from "@/pages/tools/physical-standard/components/summary"
import { GENDERS, GRADE_GROUPS, nameOf, PROJECTS, shortNameOf } from "@/pages/tools/physical-standard/model/standard"
import { cn } from "@/utils/cn"

/** 说明 */
const NOTES = [
  "体测总分由标准分与附加分相加, 标准分满分 100 分, 附加分满分 20 分.",
  "附加分只对耐力跑与力量项目生效, 达到对应成绩后按档加分.",
  "标准按性别与年级区分, 以学校正式通知为准.",
]

/** 体测标准 */
export default function PhysicalStandard(): ReactNode {
  const [gender, setGender] = useState<Gender>("male")
  const [gradeGroup, setGradeGroup] = useState<GradeGroup>("lower")
  const [projectId, setProjectId] = useState<StandardProjectId>(PROJECTS[0].id)

  const project = PROJECTS.find(item => item.id === projectId) ?? PROJECTS[0]
  const rows = project.standards[gender]
  const standardRows = rows.filter(row => row.kind === "standard")
  const bonusRows = rows.filter(row => row.kind === "bonus")

  return (
    <Page title="体测标准">
      <Main>
        <Scroll>
          <View className="flex flex-col gap-2 py-1r">
            <Summary />

            <Card className="flex flex-col gap-2 border border-default p-3">
              <Choice<Gender> label="性别" value={gender} options={GENDERS} onChange={setGender} />
              <Choice<GradeGroup> label="年级" value={gradeGroup} options={GRADE_GROUPS} onChange={setGradeGroup} />

              <View className="flex flex-wrap gap-1 pt-1">
                {PROJECTS.map((item) => {
                  const active = item.id === project.id

                  return (
                    <View
                      key={item.id}
                      className={cn(
                        "rounded-full border px-2 py-2x",
                        active
                          ? "border-primary bg-primary-invert"
                          : "border-default",
                      )}
                      onClick={() => setProjectId(item.id)}
                    >
                      <Text className={cn("text-xs", active
                        ? "text-invert"
                        : "text-default")}
                      >
                        {shortNameOf(item, gender)}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </Card>

            <Card className="flex flex-col gap-2 border border-default p-3">
              <View className="flex items-center gap-2">
                <Text className="flex-1 text-sm text-strong">{nameOf(project, gender)}</Text>
                <Text className="shrink-0 text-xs text-soft">{`占比 ${project.weight}%`}</Text>
              </View>
              <Score rows={standardRows} grade={gradeGroup} unit={project.unit} />
              {project.id === "bmi" && <Text className="text-xs text-soft">BMI = 体重 / 身高的平方</Text>}
            </Card>

            {bonusRows.length > 0 && (
              <Card className="flex flex-col gap-2 border border-default p-3">
                <View className="flex items-center gap-2">
                  <Text className="flex-1 text-sm text-strong">附加分</Text>
                  <Text className="shrink-0 text-xs text-soft">满分 20 分</Text>
                </View>
                <Score rows={bonusRows} grade={gradeGroup} unit={project.unit} bonus />
              </Card>
            )}

            <Card className="flex flex-col gap-1 border border-default p-3">
              <Text className="text-sm text-strong">毕业成绩</Text>
              <Text className="text-xs text-soft">毕业当年学年总分的 50% 与其他学年总分平均得分的 50% 之和, 同时据此评定毕业等级.</Text>
            </Card>

            <View className="flex flex-col gap-1 px-1">
              {NOTES.map(note => (
                <Text key={note} className="text-xs text-soft">{note}</Text>
              ))}
            </View>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
