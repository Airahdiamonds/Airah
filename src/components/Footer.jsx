import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
	const year = new Date().getFullYear()

	return (
		<footer className="bg-onyx font-sans text-ivory">
			{/* Editorial lede */}
			<section className="border-b border-ivory/10">
				<div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20 lg:py-24">
					<p className="text-xs uppercase tracking-[0.16em] text-champagne-soft sm:text-[13px]">
						Maison Airah
					</p>
					<h2 className="mt-5 font-serif text-[2rem] font-normal leading-tight text-ivory sm:text-4xl lg:text-5xl">
						A pursuit of brilliance,
						<br className="hidden md:block" />
						<em className="font-medium text-champagne-soft">crafted to be inherited.</em>
					</h2>
					<div className="mx-auto mt-6 h-px w-12 bg-champagne" />
					<p className="mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-ivory/72 sm:text-base">
						Since 1990, each Airah diamond has been hand-selected for its rare quality and
						set by master artisans into pieces designed to outlive trends, occasions, and
						generations.
					</p>
					<a
						href="/customize"
						className="mt-9 inline-block border border-ivory/30 px-8 py-3.5 text-xs uppercase tracking-[0.14em] text-ivory transition-colors duration-300 hover:border-champagne hover:bg-champagne hover:text-onyx sm:px-10 sm:text-[13px]"
					>
						Begin a Bespoke Piece
					</a>
				</div>
			</section>

			{/* Newsletter */}
			<section className="border-b border-ivory/10">
				<div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-end">
					<div>
						<p className="text-xs uppercase tracking-[0.16em] text-champagne-soft sm:text-[13px]">
							Private Correspondence
						</p>
						<h3 className="mt-3 max-w-2xl font-serif text-2xl leading-snug text-ivory sm:text-3xl">
							Receive invitations to private viewings &amp; new arrivals.
						</h3>
					</div>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex w-full flex-col gap-4 sm:flex-row sm:items-end"
					>
						<label className="block flex-1">
							<span className="block text-xs uppercase tracking-[0.14em] text-ivory/60">
								Email address
							</span>
							<input
								type="email"
								placeholder="you@example.com"
								required
								className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-[15px] text-ivory placeholder:text-ivory/35 outline-none transition-colors focus:border-champagne"
							/>
						</label>
						<button
							type="submit"
							className="border border-champagne bg-champagne px-7 py-3.5 text-xs uppercase tracking-[0.14em] text-onyx transition-colors duration-300 hover:bg-transparent hover:text-champagne sm:text-[13px]"
						>
							Subscribe
						</button>
					</form>
				</div>
			</section>

			{/* Columns */}
			<section>
				<div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 sm:gap-12 lg:py-16 xl:grid-cols-[1.15fr_0.85fr_0.9fr_1.1fr]">
					<div>
						<h4 className="font-serif text-2xl text-ivory">Airah Diamonds</h4>
						<p className="mt-4 max-w-sm text-[15px] leading-7 text-ivory/68">
							Fine diamond jewellery, crafted with intention and intended to be worn for
							lifetimes. Independent since 1990.
						</p>
						<div className="mt-7 flex items-center gap-2">
							<SocialLink href="#" label="Instagram" Icon={Instagram} />
							<SocialLink href="#" label="Facebook" Icon={Facebook} />
							<SocialLink href="#" label="Twitter" Icon={Twitter} />
							<SocialLink href="#" label="LinkedIn" Icon={Linkedin} />
						</div>
					</div>

					<FooterColumn
						heading="The Collection"
						links={[
							{ label: 'Engagement Rings', href: '/product/Stackable%20Rings' },
							{ label: 'Eternity Bands', href: '/product/Eternity%20Rings' },
							{ label: 'Bespoke Designs', href: '/customize' },
							{ label: 'Loose Diamonds', href: '/customize' },
							{ label: 'Diamond Education', href: '/Edu' },
						]}
					/>

					<FooterColumn
						heading="Client Services"
						links={[
							{ label: 'Order Tracking', href: '#' },
							{ label: 'Shipping & Delivery', href: '#' },
							{ label: 'Returns & Exchanges', href: '#' },
							{ label: 'Ring Sizing Guide', href: '#' },
							{ label: 'Care & Service', href: '#' },
						]}
					/>

					<div>
						<h4 className="text-xs uppercase tracking-[0.16em] text-champagne-soft sm:text-[13px]">
							Visit the Atelier
						</h4>
						<ul className="mt-5 space-y-4 text-[15px] text-ivory/72">
							<li className="flex items-start gap-3">
								<MapPin size={17} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-champagne-soft" />
								<span className="leading-7">
									456 Diamond Way
									<br />
									New York, NY 10019
								</span>
							</li>
							<li className="flex items-center gap-3">
								<Phone size={17} strokeWidth={1.5} className="flex-shrink-0 text-champagne-soft" />
								<a
									href="tel:+12125556789"
									className="transition-colors hover:text-champagne-soft"
								>
									+1 (212) 555 6789
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Mail size={17} strokeWidth={1.5} className="flex-shrink-0 text-champagne-soft" />
								<a
									href="mailto:info@airahdiamonds.com"
									className="transition-colors hover:text-champagne-soft"
								>
									info@airahdiamonds.com
								</a>
							</li>
						</ul>
						<div className="mt-7">
							<p className="text-xs uppercase tracking-[0.14em] text-ivory/50">By Appointment</p>
							<p className="mt-2 text-[15px] leading-7 text-ivory/72">
								Mon — Fri · 10am – 7pm
								<br />
								Saturday · 10am – 5pm
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Legal */}
			<div className="border-t border-ivory/10">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center text-xs uppercase tracking-[0.12em] text-ivory/50 sm:text-[13px] md:flex-row md:text-left">
					<p>© {year} Airah Diamonds · All rights reserved</p>
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						<a href="#" className="transition-colors hover:text-champagne-soft">
							Privacy
						</a>
						<a href="#" className="transition-colors hover:text-champagne-soft">
							Terms
						</a>
						<a href="#" className="transition-colors hover:text-champagne-soft">
							Shipping
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

function FooterColumn({ heading, links }) {
	return (
		<div>
			<h4 className="text-xs uppercase tracking-[0.16em] text-champagne-soft sm:text-[13px]">
				{heading}
			</h4>
			<ul className="mt-5 space-y-3.5">
				{links.map((link) => (
					<li key={link.label}>
						<a
							href={link.href}
							className="text-[15px] leading-6 text-ivory/72 transition-colors duration-200 hover:text-champagne-soft"
						>
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

function SocialLink({ href, label, Icon }) {
	return (
		<a
			href={href}
			aria-label={label}
			className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/65 transition-all duration-300 hover:border-champagne hover:text-champagne"
		>
			<Icon size={17} strokeWidth={1.5} />
		</a>
	)
}

export default Footer
