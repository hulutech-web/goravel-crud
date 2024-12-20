import useRulesStore from "@/store/useRulesStore"

export default async () => {
  await Promise.all([useRulesStore().resetRules()])
}
