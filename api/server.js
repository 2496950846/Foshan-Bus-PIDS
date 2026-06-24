import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  db.get('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: '服务器错误' })
    } else if (row) {
      res.json({ success: true, message: '登录成功' })
    } else {
      res.json({ success: false, message: '用户名或密码错误' })
    }
  })
})

app.get('/api/routes', (req, res) => {
  db.all('SELECT * FROM routes', (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: '服务器错误' })
    } else {
      res.json({ success: true, data: rows })
    }
  })
})

app.get('/api/routes/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM routes WHERE id = ?', [id], (err, route) => {
    if (err) {
      res.status(500).json({ success: false, message: '服务器错误' })
    } else if (!route) {
      res.json({ success: false, message: '线路不存在' })
    } else {
      db.all('SELECT * FROM stations WHERE route_id = ? ORDER BY order_num', [id], (err, stations) => {
        if (err) {
          res.status(500).json({ success: false, message: '服务器错误' })
        } else {
          res.json({ success: true, data: { ...route, stations } })
        }
      })
    }
  })
})

app.post('/api/routes', (req, res) => {
  const { name, from_station, to_station, stations } = req.body
  db.run('INSERT INTO routes (name, from_station, to_station) VALUES (?, ?, ?)', [name, from_station, to_station], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: '服务器错误' })
    } else {
      const routeId = this.lastID
      stations.forEach((station, index) => {
        db.run('INSERT INTO stations (route_id, name, order_num) VALUES (?, ?, ?)', [routeId, station.name, index])
      })
      res.json({ success: true, message: '线路添加成功', id: routeId })
    }
  })
})

app.put('/api/routes/:id', (req, res) => {
  const { id } = req.params
  const { name, from_station, to_station, stations } = req.body
  db.run('UPDATE routes SET name = ?, from_station = ?, to_station = ? WHERE id = ?', [name, from_station, to_station, id], (err) => {
    if (err) {
      res.status(500).json({ success: false, message: '服务器错误' })
    } else {
      db.run('DELETE FROM stations WHERE route_id = ?', [id], () => {
        stations.forEach((station, index) => {
          db.run('INSERT INTO stations (route_id, name, order_num) VALUES (?, ?, ?)', [id, station.name, index])
        })
        res.json({ success: true, message: '线路更新成功' })
      })
    }
  })
})

app.delete('/api/routes/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM stations WHERE route_id = ?', [id], () => {
    db.run('DELETE FROM routes WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ success: false, message: '服务器错误' })
      } else {
        res.json({ success: true, message: '线路删除成功' })
      }
    })
  })
})

app.get('/api/current-route', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = ?', ['current_route_id'], (err, setting) => {
    const currentRouteId = setting ? parseInt(setting.value) : null
    if (!currentRouteId) {
      res.json({
        success: true,
        data: {
          routeName: 'B25',
          fromStation: '大学城（中部枢纽）总站',
          toStation: '体育中心总站',
          stations: [
            { name: '大学城（中部枢纽）' },
            { name: '广大公寓' },
            { name: '广大生活区' },
            { name: '广大' },
            { name: '华师' },
            { name: '星海学院' },
            { name: '地铁大学城北' },
            { name: '仑头立交' },
            { name: '琶洲大桥北' },
            { name: '科韵路' },
            { name: '学院' },
            { name: '上社' },
            { name: '华景新城' },
            { name: '师大暨大' },
            { name: '岗顶' },
            { name: '石牌桥' },
            { name: '体育中心' },
            { name: '体育中心总站' }
          ]
        }
      })
      return
    }
    db.get('SELECT * FROM routes WHERE id = ?', [currentRouteId], (err, route) => {
      if (err || !route) {
        res.json({
          success: true,
          data: {
            routeName: 'B25',
            fromStation: '大学城（中部枢纽）总站',
            toStation: '体育中心总站',
            stations: [
              { name: '大学城（中部枢纽）' },
              { name: '广大公寓' },
              { name: '广大生活区' },
              { name: '广大' },
              { name: '华师' },
              { name: '星海学院' },
              { name: '地铁大学城北' },
              { name: '仑头立交' },
              { name: '琶洲大桥北' },
              { name: '科韵路' },
              { name: '学院' },
              { name: '上社' },
              { name: '华景新城' },
              { name: '师大暨大' },
              { name: '岗顶' },
              { name: '石牌桥' },
              { name: '体育中心' },
              { name: '体育中心总站' }
            ]
          }
        })
      } else {
        db.all('SELECT * FROM stations WHERE route_id = ? ORDER BY order_num', [route.id], (err, stations) => {
          res.json({
            success: true,
            data: {
              routeName: route.name,
              fromStation: route.from_station,
              toStation: route.to_station,
              stations: stations.map(s => ({ name: s.name }))
            }
          })
        })
      }
    })
  })
})

app.post('/api/current-route', (req, res) => {
  const { route_id } = req.body
  if (!route_id) {
    return res.status(400).json({ success: false, message: '参数错误' })
  }
  db.get('SELECT * FROM routes WHERE id = ?', [route_id], (err, route) => {
    if (err || !route) {
      return res.status(404).json({ success: false, message: '线路不存在' })
    }
    db.run('UPDATE settings SET value = ? WHERE key = ?', [route_id, 'current_route_id'], function(err) {
      if (err) {
        res.status(500).json({ success: false, message: '服务器错误' })
      } else {
        res.json({ success: true, message: '设置成功' })
      }
    })
  })
})

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
