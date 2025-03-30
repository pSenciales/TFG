export default function FullScreenLoader() {
    return (
        <div
            className="
          fixed 
          top-0 
          left-0 
          w-screen 
          h-screen 
          bg-black 
          bg-opacity-50 
          flex 
          items-center 
          justify-center 
          z-[9999]
        "
        >
            <div className="py-2 px-4 bg-gray-800 text-white text-xl rounded-md">
                Cargando...
            </div>
        </div>
    );
}
