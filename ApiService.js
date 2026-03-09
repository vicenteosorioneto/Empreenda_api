// services/ApiService.js
// Serviço de integração com a API Empreenda+

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:3000';

const normalizeBaseUrl = (value) => {
  if (!value || typeof value !== 'string') return DEFAULT_API_BASE_URL;
  return value.trim().replace(/\/+$/, '');
};

const resolveApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
    return normalizeBaseUrl(process.env.API_BASE_URL);
  }

  if (typeof globalThis !== 'undefined' && globalThis.__API_BASE_URL__) {
    return normalizeBaseUrl(globalThis.__API_BASE_URL__);
  }

  return DEFAULT_API_BASE_URL;
};

const API_BASE_URL = resolveApiBaseUrl();

class ApiService {
  // ==================== USUÁRIOS ====================
  
  /**
   * Criar novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Usuário criado
   */
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar usuário: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao criar usuário em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  /**
   * Buscar todos os usuários
   * @returns {Promise<Array>} Lista de usuários
   */
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar usuários em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  /**
   * Buscar usuário por ID
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar usuário em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  /**
   * Atualizar dados do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Usuário atualizado
   */
  async updateUser(userId, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar usuário: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar usuário em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  // ==================== EVENTOS ====================

  /**
   * Registrar novo evento
   * @param {Object} eventData - Dados do evento
   * @returns {Promise<Object>} Evento criado
   */
  async createEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar evento: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao criar evento em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  /**
   * Buscar todos os eventos
   * @returns {Promise<Array>} Lista de eventos
   */
  async getEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar eventos em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  /**
   * Buscar eventos de um usuário específico
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} Lista de eventos do usuário
   */
  async getEventsByUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos do usuário: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar eventos do usuário em ${API_BASE_URL}:`, error);
      throw error;
    }
  }

  // ==================== HELPERS ====================

  /**
   * Registrar login do usuário
   * @param {string} userId - ID do usuário
   */
  async trackLogin(userId) {
    return this.createEvent({
      userId,
      event: 'login',
      trail: null,
    });
  }

  /**
   * Registrar início de trilha
   * @param {string} userId - ID do usuário
   * @param {string} trailName - Nome da trilha
   */
  async trackStartTrail(userId, trailName) {
    return this.createEvent({
      userId,
      event: 'start_trail',
      trail: trailName,
    });
  }

  /**
   * Registrar conclusão de trilha
   * @param {string} userId - ID do usuário
   * @param {string} trailName - Nome da trilha
   */
  async trackCompleteTrail(userId, trailName) {
    // Atualizar contador de trilhas completadas
    const user = await this.getUserById(userId);
    await this.updateUser(userId, {
      trailsCompleted: (user.trailsCompleted || 0) + 1,
    });

    return this.createEvent({
      userId,
      event: 'complete_trail',
      trail: trailName,
    });
  }

  /**
   * Atualizar última vez que acessou
   * @param {string} userId - ID do usuário
   */
  async updateLastAccess(userId) {
    return this.updateUser(userId, {
      lastAccess: new Date().toISOString(),
    });
  }

  /**
   * Atualizar tempo de uso
   * @param {string} userId - ID do usuário
   * @param {number} minutesUsed - Minutos usados na sessão
   */
  async updateTimeUsed(userId, minutesUsed) {
    const user = await this.getUserById(userId);
    return this.updateUser(userId, {
      totalTimeUsed: (user.totalTimeUsed || 0) + minutesUsed,
    });
  }

  /**
   * Registrar ponto de desistência
   * @param {string} userId - ID do usuário
   * @param {string} dropOffPoint - Onde desistiu
   */
  async trackDropOff(userId, dropOffPoint) {
    await this.updateUser(userId, {
      dropOffPoint,
    });

    return this.createEvent({
      userId,
      event: 'drop_off',
      trail: dropOffPoint,
    });
  }
}

export default new ApiService();
