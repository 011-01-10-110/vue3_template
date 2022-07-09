import { VNode } from 'vue';

export interface menuListItem {
  label?: string
  icon?: string
  disabled?: boolean
  className?: string
  onClick: (e: Event) => any
  slot?: VNode
}
export interface MenuInterface {
  items: menuListItem[]
  zIndex?: number
  minWidth?: number
  show: boolean
  left?: string
  top?: string
  event?: MouseEvent
}
