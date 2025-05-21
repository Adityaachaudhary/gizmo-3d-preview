
import ProductViewer from "@/components/ProductViewer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">3D Product Viewer</h1>
          <p className="mt-2 text-slate-600">Interactive 3D model visualization</p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[500px]">
          <ProductViewer />
        </div>
        
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900">About This Product</h2>
          <p className="mt-2 text-slate-600">
            This is an interactive 3D model viewer that allows you to rotate, zoom, and explore the product from all angles.
            Use your mouse to rotate the model, scroll to zoom in and out, and click the reset button to return to the default view.
          </p>
          <p className="mt-4 text-slate-600">
            Built with React Three Fiber and Three.js for high-performance 3D rendering in the browser.
          </p>
        </div>
      </main>
      
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <p>© 2025 3D Product Viewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
