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

// Live-subscribes to a Firestore collection so admin edits show up on the site
// without a redeploy. `orderField` defaults to a numeric "order" field used
// throughout this project's content collections.
export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  orderField: string = 'order'
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({ data: [], loading: true, error: null });

  useEffect(() => {
    if (!db) {
      setState({ data: [], loading: false, error: new Error('Firebase is not configured') });
      return;
    }

    const constraints: QueryConstraint[] = orderField ? [orderBy(orderField)] : [];
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
  }, [collectionName, orderField]);

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
