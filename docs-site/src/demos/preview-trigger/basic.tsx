import { Link, PreviewTrigger, Button } from "@your-job-search-genius/odyssey-ui";

function avatarInitials(initials: string) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--wsu-color-secondary-bg)",
        color: "var(--wsu-color-text-heading)",
        font: "var(--wsu-font-body-sm-semibold)",
      }}
    >
      {initials}
    </div>
  );
}

interface Profile {
  handle: string;
  name: string;
  bio: string;
  initials: string;
}

function ProfilePreview({ handle, name, bio, initials }: Profile) {
  return (
    <PreviewTrigger trigger={<Link href="#">@{handle}</Link>}>
      <div style={{ width: 280 }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {avatarInitials(initials)}
          <div style={{ minWidth: 0 }}>
            <div style={{ font: "var(--wsu-font-body-sm-semibold)", color: "var(--wsu-color-text-heading)" }}>{name}</div>
            <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-subtle)" }}>@{handle}</div>
          </div>
          <Button style={{ marginLeft: "auto" }} variant="secondary" size="sm">
            Follow
          </Button>
        </div>
        <div style={{ font: "var(--wsu-font-body-sm)", color: "var(--wsu-color-text-body)", marginTop: "0.75rem" }}>{bio}</div>
      </div>
    </PreviewTrigger>
  );
}

export default function PreviewTriggerBasic() {
  return (
    <p style={{ maxWidth: 480, font: "var(--wsu-font-body-md)", color: "var(--wsu-color-text-body)" }}>
      Just shipped a new release with help from{" "}
      <ProfilePreview handle="mayachen" name="Maya Chen" bio="UI engineer, accessibility advocate, and component library enthusiast." initials="MC" />{" "}
      and <ProfilePreview handle="cwebb" name="Charles Webb" bio="Design systems, docs, and developer experience." initials="CW" />!
    </p>
  );
}
