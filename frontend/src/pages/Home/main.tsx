/**
 * @page HomePage
 * @summary Home page - main entry point for the application.
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Plutus</h1>
      <p className="text-xl text-gray-600 mb-8">Controle Financeiro Pessoal Simples</p>
      <div className="text-center text-gray-500">
        <p>Sistema pronto para receber funcionalidades</p>
      </div>
    </div>
  );
};

export default HomePage;
