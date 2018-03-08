import React from "react"
import { rhythm } from "../utils/typography"

function legitFooter() {
  return (
			<section id="footer">
				<div className="container">
					<header className="major">
						<h2>Get in touch</h2>
					</header>
					<form method="post" action="#">
						<div className="row uniform">
							<div className="6u 12u$(xsmall)"><input type="text" name="name" id="name" placeholder="Name" /></div>
							<div className="6u$ 12u$(xsmall)"><input type="email" name="email" id="email" placeholder="Email" /></div>
							<div className="12u$"><textarea name="message" id="message" placeholder="Message" rows="4"></textarea></div>
							<div className="12u$">
								<ul className="actions">
									<li><input type="submit" value="Send Message" className="special" /></li>
								</ul>
							</div>
						</div>
					</form>
				</div>
				<footer>
					<ul className="icons">
						<li><a href="#" className="icon alt fa-twitter"><span className="label">Twitter</span></a></li>
						<li><a href="#" className="icon alt fa-facebook"><span className="label">Facebook</span></a></li>
						<li><a href="#" className="icon alt fa-instagram"><span className="label">Instagram</span></a></li>
						<li><a href="#" className="icon alt fa-dribbble"><span className="label">Dribbble</span></a></li>
						<li><a href="#" className="icon alt fa-envelope"><span className="label">Email</span></a></li>
					</ul>
					<ul className="copyright">
						<li>&copy; Untitled</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li><li>Demo Images: <a href="http://unsplash.com">Unsplash</a></li>
					</ul>
				</footer>
			</section>
  )
}

export default legitFooter
