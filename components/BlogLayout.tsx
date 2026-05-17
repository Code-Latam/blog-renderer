import { ReactNode } from 'react';
import Link from 'next/link';
import './blog.css'; // Import the CSS file

interface BlogLayoutProps {
  children: ReactNode;
  blogTitle: string;
  clientId: string;
}

export function BlogLayout({ children, blogTitle, clientId }: BlogLayoutProps) {
  return (
    <div className="mm-blog-container">
      <header>
        <Link href={`/${clientId}`}>
          <h1 className="mm-blog-title">{blogTitle}</h1>
        </Link>
      </header>
      <main>{children}</main>
      <footer>
        <p>Powered by Meeting Maker</p>
      </footer>
    </div>
  );
}