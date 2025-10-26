import { getMysqlConnection } from './mysql'

export async function getDb() {
  const conn = await getMysqlConnection()
  return {
    collection: (name: string) => ({
      find: (query?: any) => ({
        toArray: async () => {
          let sql = `SELECT id, data FROM \`${name}\``
          const params: any[] = []
          if (query) {
            const conditions = buildConditions(query, params)
            if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
          }
          const [rows] = await conn.query(sql, params)
          return (rows as any[]).map(row => {
            try {
              const parsed = typeof row.data === 'object' ? row.data : JSON.parse(row.data)
              return { _id: row.id, ...parsed }
            } catch (e) {
              console.error('Invalid JSON data for id', row.id, String(e))
              return null
            }
          }).filter(Boolean)
        },
        sort: (sortObj: any) => ({
          limit: (limit: number) => ({
            toArray: async () => {
              let sql = `SELECT id, data FROM \`${name}\``
              const params: any[] = []
              if (query) {
                const conditions = buildConditions(query, params)
                if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
              }
              const sortFields = []
              for (const [key, dir] of Object.entries(sortObj)) {
                if (key === '_id') {
                  sortFields.push(`id ${dir === 1 ? 'ASC' : 'DESC'}`)
                } else {
                  sortFields.push(`JSON_EXTRACT(data, '$.${key}') ${dir === 1 ? 'ASC' : 'DESC'}`)
                }
              }
              if (sortFields.length) sql += ' ORDER BY ' + sortFields.join(', ')
              sql += ' LIMIT ?'
              params.push(limit)
              const [rows] = await conn.query(sql, params)
              return (rows as any[]).map(row => {
                try {
                  const parsed = typeof row.data === 'object' ? row.data : JSON.parse(row.data)
                  return { _id: row.id, ...parsed }
                } catch (e) {
                  console.error('Invalid JSON data for id', row.id, String(e))
                  return null
                }
              }).filter(Boolean)
            }
          })
        })
      }),
      findOne: async (query: any) => {
        let sql = `SELECT id, data FROM \`${name}\``
        const params: any[] = []
        const conditions = buildConditions(query, params)
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
        sql += ' LIMIT 1'
        const [rows] = await conn.query(sql, params)
        if ((rows as any[]).length === 0) return null
        const row = (rows as any[])[0]
        try {
          const parsed = typeof row.data === 'object' ? row.data : JSON.parse(row.data)
          return { _id: row.id, ...parsed }
        } catch (e) {
          console.error('Invalid JSON data for id', row.id, String(e))
          return null
        }
      },
      insertOne: async (doc: any) => {
        const id = doc._id ? doc._id.toString() : doc.id || require('crypto').randomUUID()
        const data = { ...doc }
        delete data._id
        delete data.id // since id is separate
        await conn.query(`INSERT INTO \`${name}\` (id, data, createdAt) VALUES (?, ?, ?)`, [id, JSON.stringify(data), new Date()])
        return { insertedId: id }
      },
      updateOne: async (query: any, update: any) => {
        const set = update.$set || update
        let sql = `UPDATE \`${name}\` SET data = JSON_SET(data`
        const params: any[] = []
        for (const [key, value] of Object.entries(set)) {
          sql += `, '$.${key}', ?`
          params.push(value)
        }
        sql += ')'
        const conditions = buildConditions(query, params)
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
        await conn.query(sql, params)
        return {}
      },
      deleteOne: async (query: any) => {
        let sql = `DELETE FROM \`${name}\``
        const params: any[] = []
        const conditions = buildConditions(query, params)
        if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
        await conn.query(sql, params)
        return {}
      },
      countDocuments: async (query?: any) => {
        let sql = `SELECT COUNT(*) as count FROM \`${name}\``
        const params: any[] = []
        if (query) {
          const conditions = buildConditions(query, params)
          if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
        }
        const [rows] = await conn.query(sql, params)
        return (rows as any[])[0].count
      }
    })
  }
}

function buildConditions(query: any, params: any[]) {
  const conditions = []
  for (const [key, value] of Object.entries(query)) {
    if (key === '_id') {
      conditions.push('id = ?')
      params.push(value != null && typeof value === 'object' && value.toString ? value.toString() : value)
    } else {
      conditions.push(`JSON_EXTRACT(data, '$.${key}') = ?`)
      params.push(value)
    }
  }
  return conditions
}