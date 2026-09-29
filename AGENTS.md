# AGENTS.md — cookie-compliance-agent-manual

Skills and cookbooks that teach a coding agent to install the Cookie Compliance
consent banner (Hu-manity.co) correctly — blocking trackers before consent, not
just showing a notice. See [README.md](README.md) for the full picture.

## Where instructions live

- **Installing a banner right now?** Load [`skills/install-banner/SKILL.md`](skills/install-banner/SKILL.md)
  and follow it — don't hand-write a banner.
- **Need a worked recipe for a specific platform or scenario?** See [`cookbooks/`](cookbooks/).
  Each skill's `references/` folder is a generated copy of these — edit the
  cookbook, never `skills/*/references/` (`scripts/sync-references.sh --check` enforces this in CI).

## Hard rules for anyone contributing here

- **No real AppIDs, customer domains, or personal data** in any file. Use
  `YOUR_APP_ID` / `example.com`.
- **Verify before you claim.** Any statement about banner behavior must be
  checked against a real install, not assumed.
- **Capability, never compliance, as the claim.** This manual helps install a
  tool correctly; it does not certify anyone's legal compliance.

## License

[MIT](LICENSE). "Cookie Compliance" is a trademark of Hu-manity.co.
