import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import DefaultButton from '../styled-components/styled-button';

interface Dependent {
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
    dependents: Dependent[];
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
            dependentName: '',
            dependentAge: '',
            dependentGender: '',
            dependent_date_of_birth: '',
            dependent_have_deficiency: false,
            dependent_name_deficiency: '',
        });
    };

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Nome completo:
                <input type="text" {...register('name', { required: "Informe o nome completo." })} />
            </label>
                <p className="text-red-500 text-sm">{errors.name?.message}</p>

            <label>
                CPF:
                <input type="text" {...register('cpf', {required: "Informe o CPF."})} />
                <p className="text-red-500 text-sm">{errors.cpf?.message}</p>
            </label>

            <label>
                Data de nascimento:
                <input type="date" {...register('date_of_birth', {required: "Informe a data de nascimento."})} />
                <p className="text-red-500 text-sm">{errors.cpf?.message}</p>
            </label>

            <label>
                Salário:
                <input type="number" step="0.01" min="0" {...register('salary', {required: "Informe o salário."})} />
            </label>

            <div>
                Possui dependentes?
                <input type="checkbox" {...register('haveDependents')} />
            </div>

            {haveDependents && (
                <>
                    <button type="button" onClick={adicionarDependente}>
                        Adicionar dependente
                    </button>

                    {fields.map((field, index) => (
                        <section key={field.id} style={{ border: '1px solid #ccc', marginTop: '1rem', padding: '1rem' }}>
                            <h4>Dependente {index + 1}</h4>

                            <label>
                                Nome do dependente:
                                <input
                                    type="text"
                                    {...register(`dependents.${index}.dependentName`, {
                                        required: 'Campo nome do dependente é obrigatório.',
                                    })}
                                />
                                {errors.dependents?.[index]?.dependentName && (
                                    <span>{errors.dependents[index].dependentName?.message}</span>
                                )}
                            </label>

                            <label>
                                Idade:
                                <input
                                    type="text"
                                    {...register(`dependents.${index}.dependentAge`, {
                                        required: 'Campo idade é obrigatório.',
                                    })}
                                />
                                {errors.dependents?.[index]?.dependentAge && (
                                    <span>{errors.dependents[index].dependentAge?.message}</span>
                                )}
                            </label>

                            <label>
                                Gênero:
                                <select
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
                                    <span>{errors.dependents[index].dependentGender?.message}</span>
                                )}
                            </label>

                            <label>
                                Data de nascimento do dependente:
                                <input
                                    type="date"
                                    {...register(`dependents.${index}.dependent_date_of_birth`, {
                                        required: 'Campo data de nascimento é obrigatório.',
                                    })}
                                />
                                {errors.dependents?.[index]?.dependent_date_of_birth && (
                                    <span>{errors.dependents[index].dependent_date_of_birth?.message}</span>
                                )}
                            </label>

                            <label>
                                Possui deficiência?
                                <input
                                    type="checkbox"
                                    {...register(`dependents.${index}.dependent_have_deficiency`)}
                                />{' '}
                                Sim
                            </label>

                            <label>
                                Nome da deficiência (caso tenha):
                                <input
                                    type="text"
                                    {...register(`dependents.${index}.dependent_name_deficiency`)}
                                />
                            </label>
                            <button type="button" onClick={() => remove(index)} style={{ marginTop: '0.5rem', color: 'red' }}>
                                Remover dependente
                            </button>
                        </section>
                    ))}
                </>
            )}

            <DefaultButton/>
        </form>
    );
}
