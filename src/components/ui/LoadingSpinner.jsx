// src/components/LoadingSpinner.jsx

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex space-x-3">
        <div 
          className="w-5 h-5 bg-orange rounded-full animate-bounce"
        ></div>
        <div 
          className="w-5 h-5 bg-green rounded-full animate-bounce" 
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div 
          className="w-5 h-5 bg-orange rounded-full animate-bounce" 
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
      
      <p className="mt-6 text-lg font-semibold bg-linear-to-r from-orange to-green bg-clip-text text-transparent">
        Loading, please wait...
      </p>
      
    </div>
  );
}