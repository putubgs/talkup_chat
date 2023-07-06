import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSession } from "next-auth/react";
import React from 'react';

interface Props {
  component: React.FC;
}

const WithAuth: React.FC<Props> = ({ component: Component }: Props) => {
  return <SessionChecker Component={Component} />
}

const SessionChecker: React.FC<{ Component: React.FC }> = ({ Component }) => {
  const { data: session, status: loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading === "loading") return;
    if (!session) router.push('/login');
  }, [session, loading, router])

  return <Component />;
}

export default WithAuth;
