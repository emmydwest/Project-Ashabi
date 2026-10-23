import { ReaderLibrary } from "@/components/reader/reader-library";

export const metadata = {
  title: "My Library",
  description: "Your followed stories, saved reading list, and reading history on Ashabi.",
};

export default function LibraryPage() {
  return <ReaderLibrary />;
}
