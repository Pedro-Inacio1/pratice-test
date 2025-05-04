import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeCard from '../components/dependents';
import '@testing-library/jest-dom';

describe('EmployeeCard', () => {
  const mockOnDelete = jest.fn();

  const employeeData = {
    id: 1,
    name: 'João Silva',
    cpf: '123.456.789-00',
    previdency_discount: 200,
    income_tax_discount: 150,
    gross_salary: 5000,
    number_dependents: 1,
    dependents: [
      {
        id: 10,
        name: 'Maria Silva',
        age: 12,
        date_of_birth: '2012-01-01',
        has_disability: true,
        disability_name: 'Visual',
      },
    ],
    onDelete: mockOnDelete,
  };

  it('renderiza nome do funcionário', () => {
    render(<EmployeeCard {...employeeData} />);
    expect(screen.getByText(/Funcionário: João Silva/i)).toBeInTheDocument();
  });

  it('mostra os detalhes ao clicar no nome', () => {
    render(<EmployeeCard {...employeeData} />);
    const toggle = screen.getByText(/Funcionário: João Silva/i);
    fireEvent.click(toggle);

    expect(screen.getByText(/CPF: 123.456.789-00/)).toBeInTheDocument();
    expect(screen.getByText(/Maria Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Deficiência: Visual/)).toBeInTheDocument();
  });

  it('chama onDelete ao clicar no botão Apagar', () => {
    render(<EmployeeCard {...employeeData} />);
    const deleteButton = screen.getByText(/Apagar/i);
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
});
