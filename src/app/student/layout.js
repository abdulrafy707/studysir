'use client'
import { Provider } from 'react-redux';
import store from '../store/store'; // Ensure this path points to your Redux store
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <Provider store={store}>
      <>
        {/* Header at the top */}
        <Header />

        {/* Flexbox layout to split the sidebar and content */}
        <div className="flex pt-16 bg-[#F0F2F5] min-h-screen"> {/* Apply background color here */}
          {/* Sidebar on the left, hidden on mobile (below md) */}
          <div className="hidden md:block md:w-1/4">
            <Sidebar />
          </div>

          {/* Main content section takes full width on mobile and 3/4 width on larger screens */}
          <div className="w-full md:w-3/4 p-6">
            {children} {/* Dynamic content from pages */}
          </div>
        </div>
      </>
    </Provider>
  );
}
