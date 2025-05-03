import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import DefaultButton from '../styled-components/styled-button';
import Swal from 'sweetalert2';

interface Dependent {
  id: number;
  dependentName: string;
  dependentAge: string;
  dependentGender: string;
  dependent_date_of_birth: string;
  dependent_have_deficiency: boolean;
  dependent_name_deficiency?: string;
}

interface FormValues {
  name: string;
  cpf: string;
  date_of_birth: string;
  salary: number;
  haveDependents: boolean;
  dependents?: Dependent[];
}

export default function MeuFormulario() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      haveDependents: false,
      dependents: [],
    },
  });

  const haveDependents = useWatch({
    control,
    name: 'haveDependents',
    defaultValue: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents',
  });

  const adicionarDependente = () => {
    append({
      id: 0,
      dependentName: '',
      dependentAge: '',
      dependentGender: '',
      dependent_date_of_birth: '',
      dependent_have_deficiency: false,
      dependent_name_deficiency: '',
    });
  };


    const onSubmit = async (data: FormValues) => {
      const numberDependets = data.dependents?.length;
      const response = await fetch('http://localhost:3000/registerTest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          cpf: data.cpf,
          gross_salary: data.salary,
          dependentsNumber: numberDependets,
          dependentes: 
            data.dependents
          
        })
      })
      if (response.ok) {
        Swal.fire({
          title: "Sucesso",
          text: "Funcionário cadastrado com sucesso!",
          icon: "success"
        });
      }
      if(!response.ok) {
        Swal.fire({
          icon: "error",
          title: "ERRO",
          text: response.statusText
        });
      }
    }

return (
  <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold mb-6 text-center">Formulário de cadastro</h1>

    <div className="space-y-4">

      <div>
        <label className="block font-medium mb-1">
          Nome completo:
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            {...register('name', { required: "Informe o nome completo." })}
          />
        </label>
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      <div>
        <label className="block font-medium mb-1">
          CPF:
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            {...register('cpf', { required: "Informe o CPF." })}
          />
        </label>
        <p className="text-red-500 text-sm">{errors.cpf?.message}</p>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Data de nascimento:
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            {...register('date_of_birth', { required: "Informe a data de nascimento." })}
          />
        </label>
        <p className="text-red-500 text-sm">{errors.date_of_birth?.message}</p>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Salário:
          <input
            type="number"
            step="0.01"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            {...register('salary', { required: "Informe o salário." })}
          />
        </label>
        <p className="text-red-500 text-sm">{errors.salary?.message}</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <label className="font-medium">Possui dependentes?</label>
        <input type="checkbox" {...register('haveDependents')} /> Sim
        <input type="checkbox" {...register('haveDependents')} /> Não
      </div>

      {haveDependents && (
        <div className="space-y-4 mt-6">
          <button
            type="button"
            onClick={adicionarDependente}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Adicionar dependente
          </button>

          {fields.map((field, index) => (
            <section key={field.id} className="border border-gray-300 p-4 rounded-md bg-gray-50">
              <h4 className="font-semibold text-lg mb-2">Dependente {index + 1}</h4>

              <div className="space-y-3">
                <label className="block">
                  Nome do dependente:
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register(`dependents.${index}.dependentName`, {
                      required: 'Campo nome do dependente é obrigatório.',
                    })}
                  />
                  {errors.dependents?.[index]?.dependentName && (
                    <span className="text-red-500 text-sm">{errors.dependents[index].dependentName?.message}</span>
                  )}
                </label>

                <label className="block">
                  Idade:
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register(`dependents.${index}.dependentAge`, {
                      required: 'Campo idade é obrigatório.',
                    })}
                  />
                  {errors.dependents?.[index]?.dependentAge && (
                    <span className="text-red-500 text-sm">{errors.dependents[index].dependentAge?.message}</span>
                  )}
                </label>

                <label className="block">
                  Gênero:
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register(`dependents.${index}.dependentGender`, {
                      required: 'Campo gênero é obrigatório.',
                    })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Não binário">Não binário</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {errors.dependents?.[index]?.dependentGender && (
                    <span className="text-red-500 text-sm">{errors.dependents[index].dependentGender?.message}</span>
                  )}
                </label>

                <label className="block">
                  Data de nascimento do dependente:
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register(`dependents.${index}.dependent_date_of_birth`, {
                      required: 'Campo data de nascimento é obrigatório.',
                    })}
                  />
                  {errors.dependents?.[index]?.dependent_date_of_birth && (
                    <span className="text-red-500 text-sm">{errors.dependents[index].dependent_date_of_birth?.message}</span>
                  )}
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`dependents.${index}.dependent_have_deficiency`)}
                  />
                  Possui deficiência?
                </label>

                <label className="block">
                  Nome da deficiência (caso tenha):
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    {...register(`dependents.${index}.dependent_name_deficiency`)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 mt-2 hover:underline"
                >
                  Remover dependente
                </button>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-6">
        <DefaultButton />
      </div>

    </div>
  </form>

);
}
