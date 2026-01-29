export const Tarjeta = ({ titulo, dato, subdato, icono }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#d3b9b9]/30 hover:shadow-md transition-shadow">
      <div>
        <div>
          <p className="text-[#8fb5b5] font-semibold text-sm">{titulo}</p>
          <h3 className="text-2xl font-bold mt-1 text-[#8c0315]">{dato}</h3>
          <p className="text-xs mt-2 text-green-600 font-bold">
            {subdato}{" "}
            <span className="text-[#8fb5b5] font-normal">vs mes pasado</span>
          </p>
        </div>
        <div>{/* Aquí puedes agregar un ícono o gráfico si lo deseas */}</div>
      </div>
    </div>
  );
};
