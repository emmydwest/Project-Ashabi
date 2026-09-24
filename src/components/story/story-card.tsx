import Link from "next/link";
import Image from "next/image";
import type { Story } from "@/lib/stories";
import { Icon } from "@/components/icons";
export function StoryCard({ story }: { story: Story }) {
  return (
    <Link className="story-card" href={"/stories/" + story.slug}>
      <div className="cover">
        <Image
          src={"/images/" + story.image + ".webp"}
          alt={"Concept artwork for " + story.title}
          fill
          sizes="(max-width:640px) 46vw, (max-width:1024px) 30vw, 22vw"
        />
        <span className="cover-label">{story.format}</span>
        <span className="card-arrow">
          <Icon name="arrow" />
        </span>
      </div>
      <h3>{story.title}</h3>
      <p>{story.genres.join(" · ")}</p>
    </Link>
  );
}
