// Identity resolution helper.
//
// Cart, favorites, and orders all support both authenticated users and
// guests. The rule is: an authenticated session ALWAYS wins. Only if the
// session is absent does the route fall back to a client-supplied
// `guestId` from the body, query, or params.
//
// Never trust an identity field that came from the client when a session
// exists — that would let one user act as another by tampering with the
// request.
export function resolveIdentity(req, source = 'body') {
	if (req.user?.user_id) {
		return { userId: req.user.user_id, guestId: null }
	}
	const guestId =
		req[source]?.guestId ?? req[source]?.guest_id ?? null
	return { userId: null, guestId }
}
