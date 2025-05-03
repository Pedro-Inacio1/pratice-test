import React, { useState, useEffect } from 'react';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';

interface Dependent {
  id: number;
  name: string;
  age: number;
  date_of_birth: string;
  has_disability: boolean;
  disability_name: string | null;
}

interface EmployeeProps {
  id: number;
  name: string;
  cpf: string;
  previdency_discount: number;
  income_tax_discount: number;
  gross_salary: number;
  number_dependents: number;
  dependents?: Dependent[];
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeProps> = ({
  id,
  name,
  cpf,
  previdency_discount,
  income_tax_discount,
  gross_salary,
  number_dependents,
  dependents = [],
  onDelete,

}) => {
  const [showDependents, setShowDependents] = useState(false);
  const [isLoadingDependents, setIsLoadingDependents] = useState(false);
  const [localDependents, setLocalDependents] = useState<Dependent[]>([]);

  const safelyRenderDependents = Array.isArray(dependents) ? dependents : [];

  useEffect(() => {
    setLocalDependents(safelyRenderDependents);
  }, [dependents]);

  const handleToggle = () => {
    setShowDependents(!showDependents);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white mb-4">
      <div className="flex justify-between items-center">
        <p
          className="text-lg font-medium cursor-pointer flex items-center"
          onClick={handleToggle}
        >
          Funcionário: {name || 'Nome não informado'} {showDependents ? <SlArrowUp /> : <SlArrowDown />}
        </p>
        <div>
          
          <button
            onClick={() => onDelete(id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
          >
            Apagar
          </button>
        </div>
      </div>
      {showDependents && (
        <div className="mt-2 border-t pt-2 space-y-2">
          <p className="text-sm text-gray-600">ID: {id || 'Não informado'}</p>
          <p className="text-sm text-gray-600">CPF: {cpf}</p>
          <p className="text-sm text-gray-600">Desconto: {previdency_discount}</p>
          <p className="text-sm text-gray-600">Desconto IRPF: {income_tax_discount}</p>
          <p className="text-sm text-gray-600">
            Salário bruto: R$ {typeof gross_salary === 'number' ? gross_salary.toFixed(2).replace('.', ',') : 'Não informado'}
          </p>
          <p className="text-sm text-gray-600">Total de dependentes: {number_dependents || 0}</p>

          <h4 className="mt-3 font-semibold">Dependentes cadastrados:</h4>
          {isLoadingDependents ? (
            <p className="text-sm text-gray-600">Carregando dependentes...</p>
          ) : localDependents.length === 0 ? (
            <p className="text-sm text-gray-600">{number_dependents > 0 ? 'Carregando dependentes...' : 'Nenhum dependente informado'}</p>
          ) : (
            <ul className="pl-4 list-disc">
              {localDependents.map((dep, index) => (
                <li key={`${dep.id}-${index}`} className="text-sm text-gray-700">
                  <strong>Nome:</strong> {dep.name || 'Não informado'},
                  <strong> Idade:</strong> {typeof dep.age === 'number' ? dep.age : 'Não informada'},
                  <strong> Nascimento:</strong> {dep.date_of_birth || 'Não informada'}
                  {dep.has_disability && (
                    <span> — <strong>Deficiência:</strong> {dep.disability_name || 'Não especificada'}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;