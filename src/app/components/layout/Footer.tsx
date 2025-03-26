import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">NoobWriters</h3>
            <p className="text-gray-300 dark:text-gray-400">
              A platform for aspiring authors to create, share and discover web novels.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/novels" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
                  Browse Novels
                </Link>
              </li>
              <li>
                <Link href="/novels/create" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
                  Write a Novel
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 dark:text-gray-400 mb-2">
              Have questions or feedback? Reach out to us!
            </p>
            <Link
              href="/contact"
              className="inline-block px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-gray-300 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} NoobWriters. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 