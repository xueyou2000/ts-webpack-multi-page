import ReactDOM from "react-dom";

/**
 * 渲染页面入口
 */
export default function loadPage(page: JSX.Element) {
    ReactDOM.render(page, document.getElementById("root") as HTMLElement);
}
