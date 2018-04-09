import React from "react"
import g from "glamorous"
import { css } from "glamor"
import Link from "gatsby-link"
import legitLogo from "./legitLogo.jpg";

import { rhythm } from "../utils/typography"

import "../styles/main.sass"

const linkStyle = css({ float: `right` })

export default ({ children, data }) =>
    <g.Div>
      <div className='headtastic'>
        <div className='portal'>
          <Link to={`/`}>
            <g.H3 marginBottom={rhythm(0)} display={`inline-block`}>
              {data.site.siteMetadata.title}
            </g.H3>
          </Link>
          <Link className={linkStyle} to={`/about/`}>
            About
          </Link>
        </div>
      </div>
      <div className='legitLogo'>
        <img src={legitLogo} height="300" alt="Legitblock" className='Thor-center' />
      </div>
      <div className='portal'>
        {children()}
      </div>
    </g.Div>

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
