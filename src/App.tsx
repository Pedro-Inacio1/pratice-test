import { useState, useEffect } from 'react';
import EmployeeCard from './components/dependents';
import debounce from 'lodash.debounce';

interface Dependent {
  id: number;
  name: string;
  age: number;
  date_of_birth: string;
  has_disability: boolean;
  disability_name: string | null;
}

interface Employee {
  id: number;
  name: string;
  cpf: string;
  gross_salary: number;
  number_dependents: number;
  dependents: Dependent[];
  previdency_discount: number;
  income_tax_discount: number;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizeGetEmployeesData = (rawData: any[]): Employee[] => {
    const employeeMap = new Map<number, Employee>();
    rawData.forEach((item) => {
      const employeeId = item.employeeId;
      if (employeeId) {
        employeeMap.set(employeeId, {
          id: employeeId,
          name: item.employee_name || '',
          cpf: item.employee_cpf || '',
          gross_salary: typeof item.gross_salary === 'number' ? item.gross_salary : 0,
          number_dependents: item.number_of_dependents || 0,
          dependents: [],
          previdency_discount: typeof item.previdency_discount === 'number' ? item.previdency_discount : 0,
          income_tax_discount: typeof item.income_tax_discount === 'number' ? item.income_tax_discount : 0,
        });
      }
    });
    return Array.from(employeeMap.values());
  };

  const normalizeSearchData = (rawData: any[]): Employee[] => {
    const employeeMap = new Map<number, Employee>();
    rawData.forEach((item) => {
      const employeeId = item.id; 
      if (employeeId) {
        employeeMap.set(employeeId, {
          id: employeeId,
          name: item.nome || '',
          cpf: item.CPF || '',  
          gross_salary: typeof item.salario_bruto === 'number' ? item.salario_bruto : 0,
          number_dependents: item.numero_dependentes || 0,
          dependents: [],
          previdency_discount: typeof item.desconto_previdencia === 'number' ? item.desconto_previdencia : 0,
          income_tax_discount: typeof item.desconto_IRPF === 'number' ? item.desconto_IRPF : 0,
        });
      }
    });
    return Array.from(employeeMap.values());
  };

  const fetchDependentsByEmployeeId = async (employeeId: number): Promise<Dependent[]> => {
    try {
      const response = await fetch(`http://localhost:3000/getDependents/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      return data.map((dep: any) => ({
        id: dep.id || 0,
        name: dep.nome || 'Nome não informado',
        age: typeof dep.idade === 'number' ? dep.idade : 0,
        date_of_birth: dep.data_nascimento || 'Data não informada',
        has_disability: dep.possui_deficiencia === 1 || dep.possui_deficiencia === true,
        disability_name: dep.nome_deficiencia || null,
      }));
    } catch (error) {
      console.error(`Erro ao buscar dependentes do funcionário ${employeeId}:`, error);
      return [];
    }
  };

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/getEmployees');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const employeeData = await response.json();

      const normalizedEmployees = normalizeGetEmployeesData(employeeData);

      const employeesWithDependents = await Promise.all(
        normalizedEmployees.map(async (employee) => {
          if (employee.number_dependents > 0) {
            const dependents = await fetchDependentsByEmployeeId(employee.id);
            return { ...employee, dependents };
          }
          return employee;
        })
      );

      setEmployees(employeesWithDependents);

    } catch (error) {
      console.error('Erro ao buscar todos os funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredEmployees = async (query: string) => {
    if (!query.trim()) {
      fetchAllEmployees();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: query, cpf: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
     
      const normalized = normalizeSearchData(data);

      const employeesWithDependents = await Promise.all(
        normalized.map(async (employee) => {
          if (employee.number_dependents > 0) {
            const dependents = await fetchDependentsByEmployeeId(employee.id);
            return { ...employee, dependents };
          }
          return employee;
        })
      );

      setEmployees(employeesWithDependents);

    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const debouncedSearch = debounce((value: string) => {
    if (value.trim()) {
      fetchFilteredEmployees(value);
    } else {
      fetchAllEmployees();
    }
  }, 400);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Funcionários</h1>

      <input
        type="text"
        className="border rounded p-2 w-full mb-4"
        placeholder="Buscar por nome ou CPF..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Carregando dados...</p>
      ) : employees.length > 0 ? (
        employees.map((emp) => (
          <EmployeeCard key={emp.id} {...emp} />
        ))
      ) : (
        <p>Nenhum funcionário encontrado.</p>
      )}
    </div>
  );
}

export default App;