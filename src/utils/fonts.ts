/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-16 17:21:46
 * @LastEditTime: 2024-08-16 17:21:50
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\utils\fonts.ts
 */
export function createFontCSS(arr: any[]) {
  let code = ''
  arr.forEach((item) => {
    code =
      code +
      `
    @font-face {
      font-family: ${item.name};
      src: url('${item.file}');
    }
    `
  })
  const style = document.createElement('style')
  try {
    style.appendChild(document.createTextNode(code))
  } catch (error) {
    // style.styleSheet.cssText = code;
  }
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
}
