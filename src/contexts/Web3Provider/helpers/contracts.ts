import { AbstractProvider, AbstractSigner } from 'ethers'

type AbstractFactoryClass = {
  connect: (
    address: string,
    provider: AbstractProvider | AbstractSigner,
  ) => unknown
  createInterface: () => unknown
}

type AbstractFactoryClassReturnType<F extends AbstractFactoryClass> = {
  contractInstance: ReturnType<F['connect']>
  contractInterface: ReturnType<F['createInterface']>
}

export const createContract = <F extends AbstractFactoryClass>(
  address: string,
  provider: AbstractProvider | AbstractSigner,
  factoryClass: F,
): AbstractFactoryClassReturnType<F> => {
  const contractInstance = factoryClass.connect(
    address,
    provider,
  ) as ReturnType<F['connect']>

  const contractInterface = factoryClass.createInterface() as ReturnType<
    F['createInterface']
  >

  return {
    contractInstance,
    contractInterface,
  }
}
