import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты | Hett Automotive",
  description:
    "Свяжитесь с нами по вопросам использования и распространения нашей продукции и сотрудничества.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
