# 📚 Exemplos de Integração - API Empreenda+

## 1️⃣ Criar Usuário no Login (LoginScreen.js)

```javascript
import ApiService from '../services/ApiService';

const LoginScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    className: '',
    age: '',
  });

  const handleLogin = async () => {
    try {
      // Criar usuário no backend
      const newUser = await ApiService.createUser({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        school: userData.school,
        className: userData.className,
        age: parseInt(userData.age),
      });

      // Salvar ID do usuário localmente
      await AsyncStorage.setItem('userId', newUser._id);
      
      // Registrar login
      await ApiService.trackLogin(newUser._id);
      
      // Navegar para o hub
      navigation.replace('MainHub', { userId: newUser._id });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar usuário');
    }
  };

  // ... resto do componente
};
```

---

## 2️⃣ Iniciar Trilha (MainHubScreen.js)

```javascript
import ApiService from '../services/ApiService';

const MainHubScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
    
    // Atualizar último acesso
    if (id) {
      await ApiService.updateLastAccess(id);
    }
  };

  const handleStartTrail = async (trail) => {
    try {
      // Registrar início da trilha
      await ApiService.trackStartTrail(userId, trail.title);
      
      // Navegar para a missão
      navigation.navigate('Mission', { trilha: trail });
    } catch (error) {
      console.error('Erro ao iniciar trilha:', error);
    }
  };

  // ... resto do componente
};
```

---

## 3️⃣ Completar Missão (MissionScreen.js)

```javascript
import ApiService from '../services/ApiService';

const MissionScreen = ({ navigation, route }) => {
  const { trilha } = route.params;
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  const handleCompleteMission = async () => {
    try {
      // Atualizar XP local
      await addXP(missaoAtual.xp);
      
      // Registrar conclusão da trilha no backend
      await ApiService.trackCompleteTrail(userId, trilha.title);
      
      // Atualizar progresso de conclusão
      const user = await ApiService.getUserById(userId);
      const completionPercentage = calculateCompletion(user);
      
      await ApiService.updateUser(userId, {
        trailCompletionPercentage: completionPercentage,
      });
      
      // Mostrar feedback
      setShowFeedback(true);
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    }
  };

  // ... resto do componente
};
```

---

## 4️⃣ Dashboard do Professor (TeacherDashboardScreen.js)

```javascript
import ApiService from '../services/ApiService';

const TeacherDashboardScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os usuários (filtrar por escola depois)
      const allUsers = await ApiService.getUsers();
      
      // Filtrar por escola do professor
      const schoolName = await AsyncStorage.getItem('teacherSchool');
      const schoolStudents = allUsers.filter(user => user.school === schoolName);
      
      // Buscar eventos de cada aluno
      const studentsWithProgress = await Promise.all(
        schoolStudents.map(async (student) => {
          const events = await ApiService.getEventsByUser(student._id);
          return {
            ...student,
            eventsCount: events.length,
            lastActivity: events[0]?.createdAt,
          };
        })
      );
      
      setStudents(studentsWithProgress);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... resto do componente
};
```

---

## 5️⃣ Rastreamento de Tempo (App.js)

```javascript
import ApiService from './services/ApiService';

const App = () => {
  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    // Registrar início da sessão
    setSessionStartTime(Date.now());

    // Registrar fim da sessão ao fechar o app
    return () => {
      trackSessionEnd();
    };
  }, []);

  const trackSessionEnd = async () => {
    if (!sessionStartTime) return;
    
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 60000);
    
    try {
      await ApiService.updateTimeUsed(userId, sessionDuration);
    } catch (error) {
      console.error('Erro ao rastrear tempo:', error);
    }
  };

  // ... resto do componente
};
```

---

## 6️⃣ Rastreamento de Desistência (useEffect no MissionScreen)

```javascript
import ApiService from '../services/ApiService';

const MissionScreen = ({ navigation, route }) => {
  const { trilha } = route.params;
  const [userId, setUserId] = useState(null);
  const [timeOnScreen, setTimeOnScreen] = useState(0);

  useEffect(() => {
    loadUserId();
    
    // Timer para rastrear tempo na tela
    const interval = setInterval(() => {
      setTimeOnScreen(prev => prev + 1);
    }, 1000);

    // Cleanup ao sair da tela
    return () => {
      clearInterval(interval);
      
      // Se ficou menos de 2 minutos, pode ser desistência
      if (timeOnScreen < 120 && userId) {
        ApiService.trackDropOff(userId, trilha.title);
      }
    };
  }, []);

  // ... resto do componente
};
```

---

## 🔧 Configuração Importante

### Alterar IP em ApiService.js

Para testar no celular via Expo, altere:

```javascript
const API_BASE_URL = 'http://SEU_IP_LOCAL:3000';
// Exemplo: 'http://192.168.1.100:3000'
```

Para descobrir seu IP:
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

### Iniciar o servidor da API

```bash
cd Empreenda_api
node src/server.js
```

---

## 📊 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /users | Criar usuário |
| GET | /users | Listar usuários |
| GET | /users/:id | Buscar usuário |
| POST | /events | Registrar evento |
| GET | /events | Listar eventos |
| GET | /events/user/:userId | Eventos por usuário |

---

## ✅ Checklist de Integração

- [ ] Copiar `ApiService.js` para `Empreenda-/services/`
- [ ] Atualizar `API_BASE_URL` com seu IP
- [ ] Instalar dependências (já existem no Expo)
- [ ] Testar criação de usuário no LoginScreen
- [ ] Testar registro de eventos nas trilhas
- [ ] Verificar dados no MongoDB Atlas
- [ ] Implementar cache/offline-first (opcional)
