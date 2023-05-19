import { useOrganization } from "@clerk/nextjs";
import { ReactNode, createContext, useContext } from "react";
import { useQuery } from "react-query";
import queries from "../queries";

type ModuleState = {
  hasModule(moduleId: string): boolean;
  getModuleById(moduleId: string): any | null;
};

const ModuleStateContext = createContext<ModuleState>({} as any);

export const ModuleStateProvider = ({ children }: { children: ReactNode }) => {
  const { organization, isLoaded } = useOrganization();

  const moduleQuery = useQuery(
    ["module-list", organization],
    queries.fetchModules,
    {
      enabled: isLoaded && organization !== undefined,
      initialData: [],
    }
  );

  const modules = moduleQuery.data || [];

  const hasModule = (moduleId: string) => {
    return modules.find((e) => e.id === moduleId) !== undefined;
  };

  const getModuleById = (moduleId: string) => {
    const module = modules.find((e) => e.id === moduleId);

    if (module === undefined) {
      return null;
    }

    return module;
  };

  return (
    <ModuleStateContext.Provider
      value={{
        hasModule,
        getModuleById,
      }}
    >
      {children}
    </ModuleStateContext.Provider>
  );
};

export const useModuleState = () => useContext(ModuleStateContext);
