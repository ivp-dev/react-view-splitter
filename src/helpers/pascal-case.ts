const rHyphen = /-(.)/g

export default function pascalCase(str: string): string {
  return str[0].toUpperCase() + str.replace(rHyphen, (_, chr) => chr.toUpperCase()).slice(1)
}