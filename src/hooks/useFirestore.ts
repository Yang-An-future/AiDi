import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

const defaultConstraints = [orderBy('order')];

// Live-subscribes to a Firestore collection so admin edits show up on the site
// without a redeploy. Pass explicit constraints (where/orderBy/limit) for
// anything beyond "everything, ordered by a numeric order field".
export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = defaultConstraints
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({ data: [], loading: true, error: null });
  const constraintsKey = JSON.stringify(constraints.map((c) => c.type));

  useEffect(() => {
    if (!db) {
      setState({ data: [], loading: false, error: new Error('Firebase is not configured') });
      return;
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as T);
        setState({ data, loading: false, error: null });
      },
      (error) => setState({ data: [], loading: false, error })
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey]);

  return state;
}

interface DocState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFirestoreDoc<T extends DocumentData>(path: string): DocState<T> {
  const [state, setState] = useState<DocState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!db) {
      setState({ data: null, loading: false, error: new Error('Firebase is not configured') });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, path),
      (snapshot) => {
        setState({ data: snapshot.exists() ? (snapshot.data() as T) : null, loading: false, error: null });
      },
      (error) => setState({ data: null, loading: false, error })
    );

    return unsubscribe;
  }, [path]);

  return state;
}
