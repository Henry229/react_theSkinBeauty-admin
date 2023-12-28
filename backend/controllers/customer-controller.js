import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (req, res) => {
  try {
    const response = await prisma.customer.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const response = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createCustomer = async (req, res) => {
  const { firstName, lastName, mobile, email } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        mobile,
        email,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { firstName, lastName, mobile, email } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: {
        id: req.params.id,
      },
      data: {
        firstName,
        lastName,
        mobile,
        email,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
