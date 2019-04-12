export default function ({ store, redirect }) {
  if (store.state.auth.token.access_token && store.state.auth.token.expires_in) {
    return redirect('/');
  }
}
