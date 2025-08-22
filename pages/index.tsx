import { LoggedOut } from "@/components/auth-forms";
import Swimlane from "@/components/swimlane";
import UnfinishedSiteWarning from "@/components/unfinished-site-warning";
import { useSwimlanes } from "@/data/swimlanes";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CompactModeProvider } from "@/hooks/useCompactModeTogglePressable";
import DefaultLayout from "@/layouts/DefaultLayout";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          window.dispatchEvent(new CustomEvent(`authChanged`));
          console.warn("Query 401 Unauthorized. Updated local auth state.");
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          window.dispatchEvent(new CustomEvent(`authChanged`));
          console.warn("Mutation 401 Unauthorized. Updated local auth state.");
        }
      }
    },
    onSuccess: (data, variables, context, mutation) => {
      if (typeof data === "object" && data !== null && "resetAuth" in data) {
        window.dispatchEvent(new CustomEvent(`authChanged`));
      }
    },
  }),
});

export default function IndexPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UnfinishedSiteWarning />
        <Toaster />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <LoggedIn /> : <LoggedOut />;
}

function LoggedIn() {
  const { data: swimlanes } = useSwimlanes();
  return (
    <Layout>
      {swimlanes?.map((swimlane) => (
        <Swimlane key={swimlane.id} details={swimlane} />
      ))}
    </Layout>
  );
}

function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <CompactModeProvider>
      <DefaultLayout>
        <div className="flex gap-4 max-h-full w-fit">{children}</div>
      </DefaultLayout>
    </CompactModeProvider>
  );
}
