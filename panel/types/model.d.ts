interface Personalcourse {
  ID?: number,
  name: string,
  coursetype_id: number,
  coursetarget_ids: CoursetargetIds
  duration: string
  mode: string
  sale_way: Array
  level_id: string
  valid_period: string
  cover_image: string
  introduction: string
  price: string
  employee_id?: number
}
