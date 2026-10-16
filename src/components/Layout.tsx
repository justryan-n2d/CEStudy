import type { ReactNode } from "react";
import { Link,NavLink } from "react-router-dom";
export function Layout({children}:{children:ReactNode}){const links=[{to:"/catalog",label:"Subject catalog"},{to:"/year/1",label:"Year levels"},{to:"/math-foundations",label:"Math foundations"}];
return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to main content</a><header className="site-header"><div className="header-inner">
<Link className="brand" to="/" aria-label="CEStudy home"><img className="brand-logo" src="/branding/cestudy-master-logo.svg" alt="" aria-hidden="true" width={52} height={52}/><span className="brand-copy"><strong>CEStudy</strong><small>Civil Engineering Reviewer</small></span></Link>
<nav className="main-nav" aria-label="Main navigation">{links.map(x=><NavLink key={x.to} to={x.to} className={({isActive})=>isActive?"nav-link active":"nav-link"}>{x.label}</NavLink>)}</nav>
</div></header><main id="main-content" className="main-content">{children}</main><footer className="site-footer"><div className="footer-inner"><div><strong>CEStudy</strong><p>A practical, student-focused Civil Engineering reviewer.</p></div><p className="footer-note">Independent educational project. Not affiliated with or endorsed by CHED.</p></div></footer></div>}
