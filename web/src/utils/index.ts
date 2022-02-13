type Obj = Record<string | number, any>

export const indexBy = <T extends Obj>(
  key: (string | number) & keyof T,
  items: T[]
): Record<keyof T, T> =>
  items.reduce(
    (result, item: T) => ({ ...result, [String(item[key])]: item }),
    {} as Record<keyof T, T>
  )

export const clone = <T>(objectToClone: T): T => JSON.parse(JSON.stringify(objectToClone))
