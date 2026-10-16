import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import App from "../../App";
describe("CEStudy app shell",()=>{it("renders identity, navigation, and main landmark",()=>{render(<App/>);expect(screen.getByRole("link",{name:/CEStudy home/i})).toBeInTheDocument();expect(screen.getByRole("navigation",{name:/main navigation/i})).toBeInTheDocument();expect(screen.getByRole("main")).toBeInTheDocument();expect(screen.getByRole("heading",{name:/find your CE subjects/i})).toBeInTheDocument()})});
