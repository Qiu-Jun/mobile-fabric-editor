/*
 * @Author: June
 * @Description:
 * @Date: 2024-08-18 02:16:06
 * @LastEditTime: 2024-08-18 02:17:10
 * @LastEditors: June
 * @FilePath: \mine-pro\packages\editor\src\core\utils\font.ts
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
    console.log(error)
    // style.styleSheet.cssText = code;
  }
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
}
