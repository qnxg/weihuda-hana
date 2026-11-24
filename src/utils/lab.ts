import { STORAGE } from "@/config/storage"
import { storage } from "@/utils/storage"

/** 是否已绑定大物实验平台 */
export function hasLabBound(): boolean {
  return storage.getItem(STORAGE.lab.bound) === "1"
}

/** 记录大物实验平台绑定状态 */
export function setLabBound(bound: boolean): void {
  if (bound)
    storage.setItem(STORAGE.lab.bound, "1")
  else
    storage.removeItem(STORAGE.lab.bound)
}
