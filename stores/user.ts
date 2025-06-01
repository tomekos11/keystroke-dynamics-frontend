import type { User } from '~/types/types';

export const useUserStore = defineStore('user', () => {
  const id = ref<User['id']>(null);
  const email = ref<User['email']>(null);
  const firstName = ref<User['firstName']>(null);
  const lastName = ref<User['lastName']>(null);
  const isActive = ref<User['isActive']>(null);
  const createdAt = ref<User['createdAt']>(null);
  const updatedAt = ref<User['updatedAt']>(null);

  const activeSecretWord = ref<User['activeSecretWord']>(null);
  const inactiveSecretWords = ref<User['inactiveSecretWords']>([]);

  const isLoggedIn = computed(() => !!email.value);

  const clear = () => {
    id.value = null;
    email.value = null;
    firstName.value = null;
    lastName.value = null;
    isActive.value = null;
    createdAt.value = null;
    updatedAt.value = null;

    activeSecretWord.value = null;
    inactiveSecretWords.value = [];
  };

  const setUser = (user: User) => {
    id.value = user.id;
    email.value = user.email;
    firstName.value = user.firstName;
    lastName.value = user.lastName;
    isActive.value = user.isActive;
    createdAt.value = user.createdAt;
    updatedAt.value = user.updatedAt;

    activeSecretWord.value = user.activeSecretWord;
    inactiveSecretWords.value = user.inactiveSecretWords;
  };

  const logout = async () => {
    clear();
    const toast = useToast();

    try {
      const res = await useFetchWithAuth<{ user: User }>('/auth/logout');

      console.log(res);
      toast.add({
        title: 'Poprawnie wylogowano',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    const { data: fetchedUser } = await useAsyncData('user', async () => {
      try {
        const user = await useFetchWithAuth<User>('/user/me');
        return user;
      } catch (err) {
        return {
          id: null,
          email: null,
          firstName: null,
          lastName: null,
          isActive: null,
          createdAt: null,
          updatedAt: null,
          activeSecretWord: null,
          inactiveSecretWords: [],
        };
      }
    });

    if (fetchedUser.value) {
      setUser(fetchedUser.value);
    }
  };

  return {
    id,
    email,
    firstName,
    lastName,
    createdAt,
    updatedAt,
    isActive,
    isLoggedIn,
    activeSecretWord,
    inactiveSecretWords,
    setUser,
    fetchUser,
    clear,
    logout,
  };
});
