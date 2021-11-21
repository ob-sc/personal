import Jacando from "../util/jacando";

const createSession = async (username: string, password: string) => {
  const jacando = new Jacando("/employees");

  const employees = await jacando.get();
};
