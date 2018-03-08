import React from "react"
import { rhythm } from "../utils/typography"

function hiTwo() {
  return (
			<section id="two" className="main special">
				<div className="container">
					<span className="image fit primary"><img src="images/pic02.jpg" alt="" /></span>
					<div className="content">
						<header className="major">
							<h2>Stuff I do</h2>
						</header>
						<p>Consequat sed ultricies rutrum. Sed adipiscing eu amet interdum lorem blandit vis ac commodo aliquet vulputate.</p>
						<ul className="icons-grid">
							<li>
								<span className="icon major fa-camera-retro"></span>
								<h3>Magna Etiam</h3>
							</li>
							<li>
								<span className="icon major fa-pencil"></span>
								<h3>Lorem Ipsum</h3>
							</li>
							<li>
								<span className="icon major fa-code"></span>
								<h3>Nulla Tempus</h3>
							</li>
							<li>
								<span className="icon major fa-coffee"></span>
								<h3>Sed Feugiat</h3>
							</li>
						</ul>
					</div>
					<a href="#three" className="goto-next scrolly">Next</a>
				</div>
			</section>
  )
}

export default hiTwo
