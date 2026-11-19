// Hourly trigger for the welcome-email sequence. It only calls the site's protected endpoint;
// the endpoint decides whether anything is allowed to send.
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(env.TARGET_URL, { method: 'POST', headers: { 'X-Cron-Secret': env.CRON_SECRET } })
      .then(response => console.log('dwn-cron', response.status))
      .catch(error => console.error('dwn-cron failed', error?.message)));
  },
};
