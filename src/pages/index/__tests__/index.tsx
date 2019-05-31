import React from "react";
import { render } from "react-testing-library";
import IndexPage from "../page";

describe("IndexPage", () => {
    test("render", () => {
        const wrapper = render(<IndexPage />);
        const text = wrapper.getByText("首页");
        expect(text.tagName).toBe("P");
    });
});
