/**
 * Created by 七夕小雨 on 2018/6/12.
 * 方向轮盘
 */
function CRocker(ui,ctrl,obj){

    //绘制背板
    var back = null;
    //绘制操作小图
    var top = null;
    //坐标初始化
    var rx = 0;
    var ry = 0;
    var dx = 0;
    var dy = 0;
    var id = -2;

    //类型 0  为4方向 1为8方向
    this.type = 0;
    //移动类型 跑步或者走路
    this.moveType = -1;
    //移动方向
    this.moveDir = -1;

    this.init = function(){
        back = ctrl.back;
        top = ctrl.top;
        back.visible = ctrl.visible;
        top.visible = ctrl.visible;
    };

    /**
     * 主循环
     */
    this.update = function(){
        if(!ctrl.visible) return;
        this.moveDir = -1;
        this.moveType = -1;
        //控制小圆
        if(IInput.touches.length == 0 || back.visible == false){
            rx = 0;
            ry = 0;
            dx = 0;
            dy = 0;
            top.x = back.x + (back.width - top.width) / 2;
            top.y = back.y + (back.height - top.height) / 2;
            id = -2;
            this.moveType = 0;
        }
        var bm = false;
        for(var i = 0;i < IInput.touches.length;i++){
            if((id == -2 && top.isSelect(IInput.touches[i].clientX,IInput.touches[i].clientY)) || id == IInput.touches[i].id){
                top.x += dx;
                top.y += dy;
                //这里应该有个坐标修正

                if(id != -2){
                    dx = IInput.touches[i].clientX - rx;
                    dy = IInput.touches[i].clientY - ry;
                }


                rx = IInput.touches[i].clientX;
                ry = IInput.touches[i].clientY;
                id = IInput.touches[i].id;

                //计算小圆位置最后影响的方向
                //计算两点间距离
                var topx = top.x + top.width / 2;
                var topy = top.y + top.height / 2;

                var backx = back.x + back.width / 2;
                var backy = back.y + back.height / 2;

                var _x = topx - backx;
                var _y = topy - backy;
                var xx = 0;
                var dir = 0;
                if(_x >= 0 && _y >= 0){
                    xx = 90;
                    dir = 1;
                }else if(_x >= 0 && _y < 0){
                    xx = 90;
                    dir = 0;
                }else if(_x < 0 && _y < 0){
                    xx = 270;
                    dir = 3
                }else if(_x < 0 && _y >= 0){
                    xx = 270;
                    dir = 2;
                }

                var tan = _y/_x;
                var angle = Math.atan(tan) * 360 / (2 * Math.PI);
                angle += xx;

                if(this.type == 0){ //4方向
                    if(angle >= 315 || angle < 45){
                        this.moveDir = 3;
                    }else if(angle >= 45 && angle < 135){
                        this.moveDir = 2;
                    }else if(angle >= 135 && angle < 225){
                        this.moveDir = 0;
                    }else if(angle >= 225 && angle < 315){
                        this.moveDir = 1;
                    }
                }else{//八方向
                    if(angle >= 337.5 || angle < 22.5){
                        this.moveDir = 3;
                    }else if(angle >= 22.5 && angle < 67.5){
                        this.moveDir = 7;
                    }else if(angle >= 67.5 && angle < 112.5){
                        this.moveDir = 2;
                    }else if(angle >= 112.5 && angle < 157.5){
                        this.moveDir = 5;
                    }else if(angle >= 157.5 && angle < 202.5){
                        this.moveDir = 0;
                    }else if(angle >= 202.5 && angle < 247.5){
                        this.moveDir = 4;
                    }else if(angle >= 247.5 && angle < 292.5){
                        this.moveDir = 1;
                    }else if(angle >= 292.5 && angle < 337.5){
                        this.moveDir = 6;
                    }
                }


                //限制
                var r = back.width / 2;

                var hd = (2 * Math.PI * (angle - 90)) / 360;
                var yx = backx + r * Math.cos(hd);
                var yy = backy + r * Math.sin(hd);
                if(dir == 0 && (topx > yx || topy < yy)){
                    cPoint(yx,yy);
                }else if(dir == 1 && (topx > yx || topy > yy)){
                    cPoint(yx,yy);
                }else if(dir == 2 && (topx < yx || topy > yy)){
                    cPoint(yx,yy);
                }else if(dir == 3 && (topx < yx || topy < yy)){
                    cPoint(yx,yy);
                }

                var l = Math.sqrt(_x * _x  + _y * _y);
                if(l > (r / 2)){
                    this.moveType = 2;
                    //log("跑")
                }else if(l > (r / 8)){
                    this.moveType = 1;
                    //log("走")
                }else {
                    this.moveType = 0;
                }

                //var s = ["下","左","右","上","左下","右下","左上","右上"];
                //log(s[this.moveDir]);
                bm = true;

            }
        }


        if(bm == false){
            rx = 0;
            ry = 0;
            dx = 0;
            dy = 0;
            top.x = back.x + (back.width - top.width) / 2;
            top.y = back.y + (back.height - top.height) / 2;
            id = -2;
            this.moveType = 0;
        }


    };

    /**
     * 操作小图坐标修正
     * @param x x偏移
     * @param y y偏移
     */
    function cPoint(x,y){
        top.x = x - top.width / 2;
        top.y = y - top.height / 2;
    }

    /**
     * 释放
     */
    this.dispose = function(){
        back.dispose();
        top.dispose();
    }

}/**
 * Created by 七夕小雨 on 2019/1/7.
 * 动画组单个动画帧数据结构
 */
function DAnimRect(rd){
    var _sf = this;
    //相对原图X
    this.x = 0;
    //相对原图Y
    this.y = 0;
    //裁剪宽度
    this.width = 0;
    //裁剪高度
    this.height = 0;
    //偏移X
    this.dx = 0;
    //偏移Y
    this.dy = 0;
    //等待时间
    this.time = 0;
    //是否工具判定
    this.effective = false;
    //音效
    this.sound = "";
    //以你下音量
    this.volume = 80;
    //发射点
    this.points = [];
    //读取数据
    this.x = rd.readInt();
    this.y = rd.readInt();
    this.width = rd.readInt();
    this.height = rd.readInt();
    this.dx = rd.readInt();
    this.dy = rd.readInt();
    this.time = rd.readInt();

    this.effective = rd.readBool();

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.points.push(new APoint(rd));
    }

    this.sound = rd.readString();
    this.volume = rd.readShort();

    this.rect = new IRect(this.x,this.y , this.x + this.width, this.y + this.height);

    this.getRect = function(){
        return _sf.rect;
    };

    this.collisionRect = new ARect(rd);

}
/**
 * 动画帧发射位置
 */
function APoint(rd){
    this.x = 0;
    this.y = 0;

    this.x = rd.readInt();
    this.y = rd.readInt();
}
/**
 * 动画帧碰撞矩形
 */
function ARect(rd){
    //自动检测碰撞局域
    this.auto = rd.readBool();
    this.x = rd.readInt();
    this.y = rd.readInt();
    this.width = rd.readInt();
    this.height = rd.readInt();
}
/**
 * Created by 七夕小雨 on 2019/3/15.
 * 背包物品类
 * @param type 物品类型 0 物品   1 武器  2 防具
 * @param id 对应ID 号
 * @param num 对应数量
 */
function DBagItem(type,id,num){
    this.type = type;
    this.id = id;
    this.num = num;

    /**
     * 使用物品
     * @param num 物品个数
     * @returns {boolean}
     */
    this.user = function(num){
        if(this.type != 0 || num > this.num) return false;
        var cof = this.findData();
        if(cof == null || cof.userType == 0) return false;
        if(IVal.scene instanceof SMain){
            RV.NowCanvas.playAnim(cof.userAnim,null,RV.NowMap.getActor(),true);
            RV.NowMap.getActor().getCharacter().setAction(cof.userAction,false,true,true);
        }else{
            cof.se.play();
        }
        var addHp = RV.GameData.actor.getMaxHP() * (cof.HpNum1 / 100) + cof.HpNum2;
        var temp = cof.dispersed / 100;
        var d1 = addHp * (1 - temp);
        var d2 = addHp * (1 + temp);
        addHp = rand(Math.floor(d1),Math.ceil(d2));

        var addMp = RV.GameData.actor.getMaxMp() * (cof.MpNum1 / 100) + cof.MpNum2;
        d1 = addMp * (1- temp);
        d2 = addMp * (1 + temp);
        addMp = rand(Math.floor(d1),Math.ceil(d2));

        var x = RV.NowMap.getActor().getCharacter().x;
        var y = RV.NowMap.getActor().getCharacter().y;

        var userRect = new IRect(1,1,1,1);
        var dir = RV.NowMap.getActor().getDir();
        if(dir == 0 || dir == 4 || dir == 5){
            userRect.x = x + cof.triggerY *RV.NowProject.blockSize;
            userRect.y = y + cof.triggerX * RV.NowProject.blockSize;
            userRect.width = cof.triggerHeight * RV.NowProject.blockSize;
            userRect.height = cof.triggerWidth * RV.NowProject.blockSize;
        }else if(dir == 1){
            userRect.x = x - ((cof.triggerX + cof.triggerWidth - 1) *RV.NowProject.blockSize);
            userRect.y = y + cof.triggerY * RV.NowProject.blockSize;
            userRect.width = cof.triggerWidth * RV.NowProject.blockSize;
            userRect.height = cof.triggerHeight * RV.NowProject.blockSize;
        }else if(dir == 2){
            userRect.x = x + cof.triggerX * RV.NowProject.blockSize;
            userRect.y = y + cof.triggerY * RV.NowProject.blockSize;
            userRect.width = cof.triggerWidth * RV.NowProject.blockSize;
            userRect.height = cof.triggerHeight * RV.NowProject.blockSize;
        }else if(dir == 3 || dir == 6 || dir == 7){
            userRect.x = x - ((cof.triggerY + cof.triggerHeight - 1) *RV.NowProject.blockSize);
            userRect.y = y - ((cof.triggerX + cof.triggerWidth - 1) *RV.NowProject.blockSize);
            userRect.width = cof.triggerHeight * RV.NowProject.blockSize;
            userRect.height = cof.triggerWidth * RV.NowProject.blockSize;
        }
        if(IVal.DEBUG){
            var ss = new ISprite(IBitmap.CBitmap(userRect.width,userRect.height),RV.NowMap.getView());
            ss.x = userRect.x;
            ss.y = userRect.y;
            ss.z = 160;
            ss.drawRect(new IRect(0,0,ss.width,ss.height),new IColor(255,125,0,255));
            ss.fadeTo(0,60);
            ss.setOnEndFade(function(s){s.dispose()});
        }


        if(cof.userType == 1){//我方角色
            if(cof.upType == 0){
                RV.GameData.actor.addPow.maxHp += cof.upValue;
            }else if(cof.upType == 1){
                RV.GameData.actor.addPow.maxMp += cof.upValue;
            }else if(cof.upType == 2){
                RV.GameData.actor.addPow.watk += cof.upValue;
            }else if(cof.upType == 3){
                RV.GameData.actor.addPow.wdef += cof.upValue;
            }else if(cof.upType == 4){
                RV.GameData.actor.addPow.matk += cof.upValue;
            }else if(cof.upType == 5){
                RV.GameData.actor.addPow.mdef += cof.upValue;
            }else if(cof.upType == 6){
                RV.GameData.actor.addPow.speed += cof.upValue;
            }else if(cof.upType == 7){
                RV.GameData.actor.addPow.luck += cof.upValue;
            }
            if(addMp != 0){
                new LNum(2 , addMp , RV.NowMap.getView() , x , y);
            }
            if(addHp != 0){
                new LNum(0 , addHp * -1 , RV.NowMap.getView() , x , y);
            }
            RV.GameData.actor.mp += addMp;
            RV.GameData.actor.hp += addHp;
            for(var id in cof.cState){
                if(cof.cState[id] == 1){
                    RV.GameData.actor.addBuff(id);
                }else if(cof.cState[id] == 2){
                    RV.GameData.actor.subBuff(id);
                }
            }

        }else if(cof.userType == 2){//投射物
            RV.NowCanvas.playBullet(cof.bullet,RV.NowMap.getActor() , x , y , {value1:addHp , value2:addMp, buff:cof.cState});
        }else if(cof.userType == 3){//范围最近敌人
            var dis = 999999;
            var tempEnemy = null;
            for(var i = 0;i<RV.NowMap.getEnemys().length;i++){
                var tempRect = RV.NowMap.getEnemys()[i].getRect();
                //怪物在范围内
                if(userRect.intersects(tempRect)){
                    //计算两点间距离
                    var tempDis = Math.abs( Math.sqrt( Math.pow((x - tempRect.centerX),2) + Math.pow((y - tempRect.centerY),2) ) );
                    if(tempDis < dis){
                        dis = tempDis;
                        tempEnemy = RV.NowMap.getEnemys()[i];
                    }
                }
            }
            //执行行为
            if(tempEnemy != null){
                handleHPMP(tempEnemy.getActor(),addHp,addMp);
                RV.NowCanvas.playAnim(cof.triggerAnim,null,tempEnemy.getActor(),true);
                //还要加BUFF
                for(var id in cof.cState){
                    if(cof.cState[id] == 1){
                        tempEnemy.addBuff(id);
                    }else if(cof.cState[id] == 2){
                        tempEnemy.subBuff(id);
                    }
                }
            }
        }else if(cof.userType == 4){//范围随机敌人
            tempEnemy = null;
            var tempList = [];
            for(i = 0;i<RV.NowMap.getEnemys().length;i++){
                tempRect = RV.NowMap.getEnemys()[i].getRect();
                //怪物在范围内
                if(userRect.intersects(tempRect)){
                    tempList.push(RV.NowMap.getEnemys()[i]);
                }
            }
            tempEnemy = RF.RandomChoose(tempList);
            //执行行为
            if(tempEnemy != null){
                handleHPMP(tempEnemy.getActor(),addHp,addMp);
                RV.NowCanvas.playAnim(cof.triggerAnim,null,tempEnemy.getActor(),true);
                //还要加BUFF
                for(var id in cof.cState){
                    if(cof.cState[id] == 1){
                        tempEnemy.addBuff(id);
                    }else if(cof.cState[id] == 2){
                        tempEnemy.subBuff(id);
                    }
                }
            }
        }else if(cof.userType== 5){//范围全部敌人
            tempList = [];
            for(i = 0;i<RV.NowMap.getEnemys().length;i++){
                tempRect = RV.NowMap.getEnemys()[i].getRect();
                //怪物在范围内
                if(userRect.intersects(tempRect)){
                    tempList.push(RV.NowMap.getEnemys()[i]);
                }
            }
            RV.NowCanvas.playAnim(cof.triggerAnim,null,null,true,userRect);
            for(i = 0;i<tempList.length;i++){
                tempEnemy = tempList[i];
                if(tempEnemy != null){
                    handleHPMP(tempEnemy.getActor(),addHp,addMp);
                    //还要加BUFF
                    for(var id in cof.cState){
                        if(cof.cState[id] == 1){
                            tempEnemy.addBuff(id);
                        }else if(cof.cState[id] == 2){
                            tempEnemy.subBuff(id);
                        }
                    }
                }
            }
        }
        //执行事件
        var trigger = RV.NowSet.findEventId(cof.eventId);
        if(trigger != null){
            trigger.doEvent();
        }
        var nowNum = num - 1;
        if(nowNum > 0){
            this.user(nowNum);
        }
        return true;
    };

    /**
     * 操作对应数值
     * @param actor 角色
     * @param addHp hp增量
     * @param addMp mp增量
     */
    function handleHPMP(actor,addHp,addMp){
        if(addMp != 0){
            actor.injure(4 , addMp );
        }
        if(addHp != 0){
            actor.injure(0 , addHp );
        }
    }


    /**
     * 寻找对应数据
     * @returns {DSetArmor|null|DSetItem|DSetArms}
     */
    this.findData = function(){
        if(this.type == 0){
            return RV.NowSet.findItemId(this.id);
        }else if(this.type == 1){
            return RV.NowSet.findArmsId(this.id);
        }else if(this.type == 2){
            return RV.NowSet.findArmorId(this.id);
        }
        return null;
    }
}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 地图中绘制图块数据结构
 */
function DBlock(rd){
    //图块类型
    this.type = 0;
    //图块ID
    this.id = 0;
    //取自图块偏移x位置
    this.x = 0;
    //取自图块偏移y位置
    this.y = 0;
    //图块宽度
    this.width = 1;
    //图块高度
    this.height = 1;
    //绘制索引
    this.drawIndex = 0;
    //内部块
    this.inBlock = null;
    //触发器
    this.trigger = null;

    //读取数据
    this.type = rd.readShort();
    this.id = rd.readShort();
    this.x = rd.readShort();
    this.y = rd.readShort();
    this.width = rd.readShort();
    this.height = rd.readShort();

    this.drawIndex = rd.readShort();

    var isa = rd.readBool();
    if(isa){
        this.inBlock = new DBlock(rd);
    }
    isa = rd.readBool();
    if(isa){
        this.trigger = new DTrigger(rd);
        this.trigger.father = this;
    }
    this.isAuto = rd.readBool();

}/**
 * Created by 七夕小雨 on 2019/4/29.
 * BUFF执行数据结构 / BUFF数据逻辑部分
 * @param cof  配置数据
 * @param self buff接受者
 */
function DBuff(cof , self){
    //==================================== 私有属性 ===================================
    var _sf = this;
    //角色LActor对象
    var actor = self.getActor();
    //坐标
    var x = actor.getCharacter().x;
    var y = actor.getCharacter().y;
    //结束标识
    var isEnd = false;
    var tempEnd = false;
    //动画配置
    var animcof = RV.NowRes.findResAnim(cof.animID);
    //当前动画
    var anim = null;
    //buff间隔
    var intervalNow = 0;
    var intervalMax = cof.cTimes;
    //增加数值
    var minAddHp = self.getMaxHP() * cof.cHP / 100;
    var minAddMp = self.getMaxMp() * cof.cMP / 100;
    //增加移动和攻速
    var changeSpeed = 1 + cof.cSpeed / 100;
    //==================================== 公有属性 ===================================
    //结束类型
    this.endType = 0;
    //结束时间
    this.endTime = 0;
    //结束HP
    this.endHP = 0;
    //结束步数
    this.endMove = 0;
    //结束回调
    this.endDo = null;
    //==================================== 初始化逻辑 ==================a=================

    if(animcof != null){
        var haveView = true;
        var point = animcof.point;
        if(point.type == 0){//相对坐标
            if(point.dir == 5){//画面
                haveView = false;
            }
        }else{//绝对坐标
            haveView = false;
        }
        if(animcof instanceof DResAnimFrame){
            anim = new LAnim(animcof,haveView ? RV.NowMap.getView() : null,false,actor);
        }else if(animcof instanceof  DResAnimParticle){
            anim = new LParticle(animcof,haveView ? RV.NowMap.getView() : null,false,actor);
        }
    }

    if(cof.RelieveOutOfCombat){
        this.endType = 0;
    }else if(cof.RelieveTime){
        this.endType = 1;
        this.endTime = cof.RTime * 60;
    }else if(cof.RelieveHP){
        this.endType = 2;
        this.endHP = self.sumHp + (self.getMaxHP() * cof.RHP / 100);
    }else if(cof.RelieveMove){
        this.endType = 3;
        if(self instanceof GActor){
            this.endMove = RV.GameData.step + cof.RMove;
        }else{
            this.endMove = actor.moveNum + cof.RMove;
        }
    }

    //==================================== 公有函数 ===================================

    /**
     * 主刷新
     */
    this.update = function(){
        if(isEnd)return;
        if(tempEnd) {
            _sf.overBuff();
            return;
        }
        //处理结束
        if(_sf.endType == 0 && actor.combatTime <= 0){
            tempEnd = true;
            return;
        }
        if(_sf.endType == 1 && _sf.endTime <= 0){
            tempEnd = true;
            return;
        }
        if(_sf.endType == 2 && self.sumHp > this.endHP){
            tempEnd = true;
            return;
        }if(_sf.endType == 3){
            if(self instanceof GActor && RV.GameData.step > _sf.endMove){
                tempEnd = true;
                return;
            }else if(self.moveNum > _sf.endMove){
                tempEnd = true;
                return;
            }
        }
        actor = self.getActor();
        if(_sf.endType == 1) _sf.endTime -= 1;
        if(anim != null) anim.update();
        if(intervalNow <= 0){
            x = actor.getCharacter().x;
            y = actor.getCharacter().y;
            intervalNow = intervalMax;
            //执行HP增减
            if(cof.cHpBool){
                if(self instanceof LEnemy){
                    actor.injure(0 , minAddHp * -1);
                }else{
                    RV.NowMap.getActor().injure(0 , minAddHp * -1);
                    new LNum(0 , minAddHp * -1 , RV.NowMap.getView() , x , y);
                }
            }
            if(cof.cMpBool){
                self.mp += minAddMp;
                new LNum(2 , minAddMp , RV.NowMap.getView() , x , y);
            }
            //执行速度改变
            if(cof.cSpeedBool){
                actor.speedEfficiency = changeSpeed;
            }
        }
        intervalNow -= 1;
        //无敌与霸体
        if(cof.invincible){
            actor.invincible(60);
        }
        if(cof.superArmor){
            actor.superArmor = true;
        }
        if(cof.limit.cantAtk){
            self.LAtk = true;
        }
        if(cof.limit.cantSkill){
            self.LSkill = true;
        }
        if(cof.limit.cantItem){
            self.LItem = true;
        }
        if(cof.limit.cantMove){
            self.LMove = true;
        }
        if(cof.limit.cantSquat){
            self.LSquat = true;
        }
        if(cof.limit.cantJump){
            self.LJump = true;
        }
        if(cof.limit.cantOutOfCombat){
            self.LOutOfCombat = true;
        }

    };
    /**
     * buff结束
     */
    this.overBuff = function(){
        isEnd = true;
        _sf.dispose();
        if(cof.invincible){
            //actor.endIncible();
        }
        if(cof.superArmor){
            actor.superArmor = false;
        }

        if(cof.limit.cantAtk){
            self.LAtk = false;
        }
        if(cof.limit.cantSkill){
            self.LSkill = false;
        }
        if(cof.limit.cantItem){
            self.LItem = false;
        }
        if(cof.limit.cantMove){
            self.LMove = false;
        }
        if(cof.limit.cantSquat){
            self.LSquat = false;
        }
        if(cof.limit.cantJump){
            self.LJump = false;
        }
        if(cof.limit.cantOutOfCombat){
            self.LOutOfCombat = false;
        }
        if(cof.cSpeedBool){
            actor.speedEfficiency = 1;
        }
        if(_sf.endDo != null) _sf.endDo();
    };

    /**
     * 获得buff的配置数据
     * @returns {DSetState}
     */
    this.getData = function(){
        return cof;
    };
    /**
     * 获得buff的图标文件
     * @returns {string}
     */
    this.getIcon = function(){
        if(cof != null){
            return cof.pic;
        }
        return null;
    };
    /**
     * 释放buff
     */
    this.dispose = function(){
        if(anim != null) anim.dispose();
    }


}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 触发内容数据结构
 */
function DEvent(parent){
    //触发编号
    this.code = 0;
    //参数
    this.args = [];
    //子触发内容组
    this.events = null;
    //父触发组
    this.parent = parent;

    //读取数据
    this.read = function(rd){
        this.code = rd.readShort();
        var length = rd.readInt();
        for(var i = 0;i<length;i++){
            this.args.push(rd.readString());
        }
        length = rd.readInt();
        if(length >= 0){
            this.events = [];
            for(i = 0;i<length;i++){
                var et = new DEvent(this);
                et.read(rd);
                this.events.push(et);
            }
        }
    };
}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 有关工程条件的表达和逻辑
 */
function DIf(rd){
    //组合模式 0、AND 1、OR
    this.type = 0;
    //是否有除此之外的情况
    this.haveElse = true;
    //单个条件项
    this.items = [];

    this.tag = null;


    //读取数据
    if(rd != null){
        this.type = rd.readInt();
        this.haveElse = rd.readBool();
        var length = rd.readInt();

        for(var i = 0;i<length;i++){
            this.items.push(new DIfItem(rd));
        }
    }

    this.setOutData = function(s,o){
        for(var i = 0;i<this.items.length;i++){
            this.items[i].setOutData(s,o);
        }
    };


    /**
     * DIf 的运算结果
     * @returns {boolean}
     */
    this.result = function(){
        if(this.items.length <= 0){
            return true;
        }
        if(this.type == 0){//满足全部条件
            var num = 0;
            for(var i = 0;i<this.items.length;i++){
                if(this.items[i].result(this.tag)){
                    num += 1;
                }
            }
            return num >= this.items.length;
        }else if(this.type == 1){//满足任意条件
            for(i = 0;i<this.items.length;i++){
                if(this.items[i].result(this.tag)){
                    return true;
                }
            }
        }
        return false;

    }
}

/**
 * 单个条件分栏
 */
function DIfItem(rd){
    //条件分页
    this.type = 0;
    //值1
    this.num1Index = 0;
    //方法
    this.fuc = 0;
    //类型2
    this.type2 = 0;
    //值2
    this.num2 = "";
    //值2索引
    this.num2Index = 0;

    var _sf = null;
    var obj = null;

    this.setOutData = function(s,o){
        _sf = s;
        obj = o;
    };

    //读取数据
    if(rd != null){
        this.type = rd.readInt();
        this.num1Index = rd.readInt();
        this.fuc = rd.readInt();
        this.type2 = rd.readInt();
        this.num2 = rd.readString();
        this.num2Index = rd.readInt();
    }



    /**
     * 获得DIfItem 的运算结果
     * @returns {boolean}
     */
    this.result = function(tag){
        if(this.type == 0){//变量运算
            var val = RV.GameData.value[this.num1Index];
            if(val == null) return false;
            if(this.type2 == 0){//固定值
                if(val === true || val === false){
                    return this.operation(val , this.num2 == "1" , this.fuc);
                }else if(!isNaN(val)){
                    return this.operation(val , parseInt(this.num2) , this.fuc);
                }else if(typeof(val)=='string'){
                    return this.operation(val , this.num2 , this.fuc);
                }
            }else{//变量
                var val2 = RV.GameData.value[this.num2Index];
                if(val2 == null) return false;
                return this.operation(val , val2 , this.fuc);
            }
        }else if(this.type == 1){//敌人运算
            var enemy = RV.NowMap.findEnemy(this.num1Index);
            if(enemy == null) return false;
            if(this.fuc == 0){
                return enemy.getDir() == this.num2Index;
            }else if(this.fuc == 1){
                if(this.type2 == 0){
                    return enemy.hp >= enemy.getData().maxHp * (this.num2Index / 100);
                }else if(this.type2 == 1){
                    return enemy.hp <= enemy.getData().maxHp * (this.num2Index / 100);
                }
            }else if(this.fuc == 2){
                return enemy.findBuff(this.num2Index) != null;
            }else if(this.fuc == 3){
                return enemy.isDie;
            }
        }else if(this.type == 2){//角色的一堆判定
            if(this.fuc == 0){
                return RV.GameData.actor.getActorId() == this.num1Index;
            }else if(this.fuc == 1){
                return RV.GameData.actor.name == this.num2;
            }else if(this.fuc == 2){
                return RV.GameData.actor.skill.indexOf(this.num1Index) >= 0;
            }else if(this.fuc == 3){
                return RV.GameData.actor.equips[-1] == this.num1Index;
            }else if(this.fuc == 4){
                for(var key in RV.GameData.actor.equips){
                    if(RV.GameData.actor.equips[key] == this.num1Index && key != "-1"){
                        return true;
                    }
                }
                return false;
            }else if(this.fuc == 5){
                return RV.NowMap.getActor().getDir() == this.num1Index;
            }else if(this.fuc == 6){
                if(this.num2Index == 0){
                    return RV.GameData.actor.hp >= RV.GameData.actor.getMaxHP() * (this.num1Index / 100);
                }else if(this.num2Index == 1){
                    return RV.GameData.actor.hp <= RV.GameData.actor.getMaxHP() * (this.num1Index / 100);
                }
            }else if(this.fuc == 7){
                return RV.GameData.actor.findBuff( RV.NowSet.findStateId(this.num1Index).id);
            }else if(this.fuc == 8){
                return RV.IsDie;
            }
        }else if(this.type == 3){//其他判定
            if(this.fuc == 0){
                if(this.num2Index == 0){
                    return RV.GameData.money >= this.num1Index;
                }else if(this.num2Index == 1){
                    return RV.GameData.money < this.num1Index;
                }
            }else if(this.fuc == 1){
                return RV.GameData.findItem(0,this.num1Index) != null;
            }else if(this.fuc == 2){
                return RV.GameData.findItem(1,this.num1Index) != null;
            }else if(this.fuc == 3){
                return RV.GameData.findItem(2,this.num1Index) != null;
            }else if(this.fuc == 4){
                if(this.num2Index == 0){
                    return IInput.isKeyDown(this.num1Index);
                }else{
                    return IInput.isKeyPress(this.num1Index);
                }
            }else if(this.fuc == 5){
                var rect = this.num2.split(",");
                if(this.num2Index == 0){
                    return IInput.up && IInput.x >= parseInt(rect[0]) && IInput.y >= parseInt(rect[1]) &&
                        IInput.x <= parseInt(rect[0]) + parseInt(rect[2]) &&
                        IInput.y <= parseInt(rect[1]) + parseInt(rect[3]);
                }else if(this.num2Index == 1){
                    return IInput.down && IInput.x >= parseInt(rect[0]) && IInput.y >= parseInt(rect[1]) &&
                        IInput.x <= parseInt(rect[0]) + parseInt(rect[2]) &&
                        IInput.y <= parseInt(rect[1]) + parseInt(rect[3]);
                }
            }else if(this.fuc == 6){
                if(this.num1Index == 2){
                    return IVal.Platform == "Android";
                }else if(this.num1Index == 3){
                    return IVal.Platform == "iOS";
                }else if(this.num1Index == 4){
                    return IVal.Platform == "WeiXin";
                }else if(this.num1Index == 0){
                    return IVal.Platform == "Windows";
                }else if(this.num1Index == 1){
                    return IVal.Platform == "Web";
                }
            }else if(this.fuc == 7){
                var end = null;
                try{
                    end = eval(this.num2);
                    if(typeof end == "boolean"){
                        return end;
                    }else{
                        return end != null;
                    }
                }catch(e){
                    return false;
                }
            }else if(this.fuc == 8){
                if(tag == null) return false;
                return tag.getSwitch(this.num1Index);
            }
        }
        return false;
    };

    /**
     * 数值操作法
     * @param value1 数值1
     * @param value2 数值2
     * @param func 比较方法
     * @returns {boolean} 是否符合预期
     */
    this.operation = function(value1 , value2 , func){
        if(func == 0){
            return value1 == value2;
        }else if(func == 1){
            return value1 != value2;
        }else if(func == 2){
            return value1 > value2;
        }else if(func == 3){
            return value1 < value2;
        }else if(func == 4){
            return value1 >= value2;
        }else if(func == 5){
            return value1 <= value2;
        }
        return false;
    }
}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 地图数据
 */
function DMap(rd){
    //地图ID
    this.id = 0;
    //地图名称
    this.name = "";
    //地图宽度
    this.width = 20;
    //地图高度
    this.height = 12;
    //地图场景
    this.backgroundId = 1;
    //地图BGM
    this.bgm = new DSetSound();
    //地图BGS
    this.bgs = new DSetSound();
    //地图是否自动移动
    this.autoMove = false;
    //自动移动速度
    this.autoMoveSpeed = 4;

    //以下是绘制区域

    //图块1层
    this.level1 = [];
    //图块2层
    this.level2 = [];
    //图块3层
    this.level3 = [];

    //通行
    this.current = [];

    //地图的父ID（游戏无效）
    this.fid = -1;
    //地图排序（游戏无效）
    this.order = 0;

    this.trigger = [];
    this.enemys = [];



    //读取数据
    this.id = rd.readShort();
    this.name = rd.readString();
    this.width = rd.readShort();
    this.height = rd.readShort();
    this.backgroundId = rd.readShort();
    this.bgm = new DSetSound(rd);
    this.bgs = new DSetSound(rd);
    this.autoMove = rd.readBool();
    this.autoMoveSpeed = rd.readShort();
    this.autoDir = rd.readShort();

    this.fid = rd.readShort();
    this.order = rd.readShort();

    var i = 0;
    var j = 0;
    var k = 0;
    var at;
    for(i = 0;i<3;i++){
        this.level1[i] = [];
        this.level2[i] = [];
        this.level3[i] = [];
        for(j = 0;j<this.width;j++){
            this.level1[i][j] = [];
            this.level2[i][j] = [];
            this.level3[i][j] = [];
        }
    }


    //图层1
    for(i = 0;i<this.width;i++){
        for(j = 0;j<this.height;j++){
            for(k = 0;k<3;k++){
                var pow = rd.readShort();
                if(pow == -31822){
                    this.level1[k][i][j] = null;
                }else{
                    at = new DBlock(rd);
                    this.level1[k][i][j] = at;
                }
            }

        }
    }
    //图层2
    for(i = 0;i<this.width;i++){
        for(j = 0;j<this.height;j++){
            for(k = 0;k<3;k++){
                pow = rd.readShort();
                if(pow == -31822){
                    this.level2[k][i][j] = null;
                }else{
                    at = new DBlock(rd);
                    this.level2[k][i][j] = at;
                }
            }

        }
    }
    //图层3
    for(i = 0;i<this.width;i++){
        for(j = 0;j<this.height;j++){
            for(k = 0;k<3;k++){
                pow = rd.readShort();
                if(pow == -31822){
                    this.level3[k][i][j] = null;
                }else{
                    at = new DBlock(rd);
                    this.level3[k][i][j] = at;
                }
            }

        }
    }
    //读取通行
    for(i = 0;i<this.width * 2;i++){
        this.current[i] = [];
        for(j =0;j<this.height * 2;j++){
            this.current[i][j] = rd.readBool();
        }
    }

    //读取触发器
    var length = rd.readInt();
    for(i = 0;i<length;i++){
        var tg = new DTrigger(rd);
        this.trigger.push(tg);
    }
    //读取敌人
    length = rd.readInt();
    for(i = 0;i<length;i++){
        this.enemys.push(new DMapEnemy(rd));
    }


}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 地图怪物数据
 */
function DMapEnemy(rd){
    //怪物索引标识
    this.index = 0;
    //怪物ID
    this.eid = 0;
    //怪物朝向
    this.dir = 0;
    //怪物X坐标
    this.x = 0;
    //怪物Y坐标
    this.y = 0;
    //是否是活动的
    this.isActivity = true;
    //是否可见
    this.isVisible = true;

    //读取数据
    if(rd != null){
        this.index = rd.readInt();
        this.eid = rd.readShort();
        this.dir = rd.readShort();
        this.x = rd.readShort();
        this.y = rd.readShort();
        this.isActivity = rd.readBool();
        this.isVisible = rd.readBool();
    }


}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 工程数据·总结构
 */
function DProject(onload){

    var _sf = this;
    //工程名称
    this.name = "";
    //工程唯一Key
    this.key = "";
    //工程数据版本号
    this.code = 0;
    //工程单位块尺寸
    this.blockSize = 48;
    //工程分辨率·宽度
    this.gameWidth = 960;
    //工程分辨率·高度
    this.gameHeight = 540;
    //工程游戏类型 0、ACT 1、ARPG 2、AVG
    this.gameType = 0;
    //起始地图编号
    this.startId = 1;
    //起始地图X坐标
    this.startX = 0;
    //起始地图Y坐标
    this.startY = 0;
    //工程所属用户
    this.owner = "";
    //工程是否被锁定
    this.isLock = false;
    //工程地图数据
    this.maps = [];
    //工程变量数据
    this.values = [];

    //读取工程数据文件
    var file = "Game.ifaction";
    var rd = new IRWFile(file);
    //考虑到Web端文件为异步读取，所以需要设置读取回调给IRWFile;
    var onloadE = onload;

    //读取工程数据
    rd.onload = function(){
        var ms = rd.readMS(8);
        if(ms == "IFACTION"){
            _sf.name = rd.readString();
            _sf.key = rd.readString();
            _sf.code = rd.readInt();
            _sf.blockSize = rd.readInt();
            _sf.gameWidth = rd.readInt();
            _sf.gameHeight = rd.readInt();
            _sf.gameType = rd.readInt();
            _sf.startId = rd.readInt();
            _sf.startX = rd.readInt();
            _sf.startY = rd.readInt();

            _sf.owner = rd.readString();
            _sf.isLock = rd.readBool();

            var length = rd.readInt();
            for(var i = 0;i<length;i++){
                var mp = new DMap(rd);
                _sf.maps.push(mp);
            }

            length = rd.readInt();
            for(i = 0;i<length;i++){
                var val = new DValue(rd);
                _sf.values.push(val);
            }

            onloadE();

        }
    };

    /**
     * 初始化变量库
     * @param data 原始变量数据
     * @returns {Array} 可用于游戏中使用的变量数据
     */
    this.initValue = function(data){
        var vals = [];
        for(var i = 0;i< _sf.values.length;i++){
            var value = _sf.values[i].defValue;
            if(_sf.values[i].type == 0){
                value = value == "1";
            }else if(_sf.values[i].type == 1){
                value = parseInt(value);
            }
            if(_sf.values[i].staticValue && data != null && data[_sf.values[i].id] != null){
                vals[_sf.values[i].id] = data[_sf.values[i].id];
            }else{
                vals[_sf.values[i].id] = value;
            }

        }
        return vals;
    };

    /**
     * 寻找 ID号对应的地图
     * @param id 地图ID
     * @returns {DMap} 地图数据实例
     */
    this.findMap = function(id){
        for(var i = 0;i<_sf.maps.length;i++){
            if(_sf.maps[i].id == id){
                return _sf.maps[i];
            }
        }
        return null;
    };


}/**
 * Created by 七夕小雨 on 2019/1/7.
 */
function DRes(onload){

    var _sf = this;

    //资源版本号
    this.code = 0;
    //场景资源
    this.resScene = [];
    //图块资源
    this.resBBlock = [];
    //行走图资源
    this.resActor = [];
    //饰品资源
    this.resDecorate = [];
    //动画资源
    this.resAnim = [];

    var onloadE = onload;
    //读取数据
    var rd = new IRWFile("Resource.ifres");
    rd.onload = function(){
        _sf.code = rd.readShort();

        var length = rd.readInt();
        for(var i = 0;i<length;i++){
            rd.readShort();
            rd.readString();
            rd.readString();
            rd.readShort();
            rd.readString();
            rd.readShort();
            rd.readShort();
            rd.readShort();
            rd.readShort();
            rd.readShort();
        }

        length = rd.readInt();
        for(i = 0;i < length; i++){
            var temp = new DResBaseBlock(rd);
            _sf.resBBlock[temp.id] = temp;
        }

        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DResActor(rd);
            _sf.resActor[temp.id] = temp;
        }

        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DResDecorate(rd);
            _sf.resDecorate[temp.id] = temp;
        }

        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DResScene(rd);
            _sf.resScene[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            var type = rd.readShort();
            if(type == -3310){
                temp = new DResAnimFrame(rd);
                _sf.resAnim[temp.id] = temp;
            }else if(type == -2801){
                temp = new DResAnimParticle(rd);
                _sf.resAnim[temp.id] = temp;
            }
        }


        onloadE();

    };
    /**
     * 寻找场景资源
     * @param id
     * @returns {DResScene}
     */
    this.findResMap = function(id){
        return _sf.resScene[id];
    };
    /**
     * 寻找图块资源
     * @param id
     * @returns {DResBaseBlock}
     */
    this.findResBlock = function(id){
        return _sf.resBBlock[id];
    };
    /**
     * 读取行走图资源
     * @param id
     * @returns {DResActor}
     */
    this.findResActor = function(id){
        return _sf.resActor[id];
    };
    /**
     * 读取饰品资源
     * @param id
     * @returns {DResDecorate}
     */
    this.findResDecorate = function(id){
        return _sf.resDecorate[id];
    };

    /**
     * 寻找动画配置数据
     * @param id
     * @returns DResAnimFrame
     */
    this.findResAnim = function(id){
        return _sf.resAnim[id];
    }

}/**
 * Created by 七夕小雨 on 2019/1/7.
 * 行走图数据结构
 */
function DResActor(rd){

    var _sf = this;
    //文件索引
    this.actionName = [];
    //动作索引
    this.actionList = [];

    //行走图ID
    this.id = 0;
    //行走图名称
    this.name = "";
    //行走图说明
    this.msg = "";
    //行走图基础文件
    this.file = "";
    //相关动画组
    this.standA = [];
    this.walkA = [];
    this.runA = [];
    this.attackA = [];
    this.attackRunA = [];
    this.injuredA = [];
    this.deathA = [];

    this.otherAnim =[];

    this.other1A = [];
    this.other2A = [];
    this.other3A = [];
    this.other4A = [];
    this.other5A = [];
    this.other6A = [];
    this.other7A = [];
    this.other8A = [];
    this.other9A = [];

    //读取数据
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();
    this.file = rd.readString();

    this.norms = rd.readShort();

    readAnim(this.standA,rd);
    readAnim(this.walkA, rd);
    readAnim(this.runA, rd);
    readAnim(this.attackA, rd);
    readAnim(this.injuredA,rd);
    readAnim(this.deathA,rd);
    readAnim(this.attackRunA,rd);

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        rd.readString();//跳过名称
        var tempList = [];
        readAnim(tempList,rd);
        this.otherAnim.push(tempList);
    }

    function readAnim(list,rd){
        var l = _sf.norms == 0 ? 4 : 8;
        for(var i = 0;i<l;i++){
            var length = rd.readInt();
            list[i] = [];
            for(var j = 0;j<length;j++){
                list[i].push(new DAnimRect(rd));
            }
        }
    }

    //文件索引
    this.actionName = [
        "_stand.png", "_walk.png","_run.png",
        "_attack.png","_attack-run.png",
        "_injured.png","_death.png"];

    for(i = 0;i<this.otherAnim.length;i++){
        this.actionName.push("_other" + (i + 1) + ".png");
    }

    //动作索引
    this.actionList = [
        this.standA, this.walkA,this.runA,
        this.attackA,this.attackRunA,
        this.injuredA,this.deathA];

    for(i = 0;i<this.otherAnim.length;i++){
        this.actionList.push(this.otherAnim[i]);
    }

    /**
     * 缓存行走图
     */
    this.loadCache = function(){
        for(var i = 0;i < _sf.actionList.length;i++){
            if(_sf.actionList[i].length > 0){
                RF.LoadCache("Characters/" + _sf.file + _sf.actionName[i]);
            }
        }
    }


}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 关键帧动画
 */
function DResAnimFrame(rd){
    //动画组
    this.anims = [];
    //关键帧动作集合
    this.actionList = [];

    //动画ID
    this.id = rd.readShort();
    //动画名称
    this.name = rd.readString();
    //动画说明
    this.msg = rd.readString();
    //动画出现位置
    this.point = new DResAnimPoint(rd);
    //动画文件
    this.file = rd.readString();

    //读入动画组与关键帧动作合计
    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.anims.push(new DAnimRect(rd));
    }

    length = rd.readInt();
    for(i = 0;i<length;i++){
        this.actionList.push(new DResAnimFrameAction(rd));
    }

}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 关键帧动画动作数据结构
 */
function DResAnimFrameAction(rd){
    //闪烁颜色
    this.color = [0,0,0,0];
    //角色闪烁颜色
    this.actorColor = [0,0,0,0];

    //帧数
    this.index = rd.readShort();
    //是否存在判定区域
    this.isAtk = rd.readBool();
    //区域X
    this.AtkX = rd.readShort();
    //区域Y
    this.AtkY = rd.readShort();
    //区域宽度
    this.AtkWidth = rd.readShort();
    //区域高度
    this.AtkHeight = rd.readShort();
    //是否闪烁
    this.isFlash = rd.readBool();
    this.color[0] = rd.readShort();
    this.color[1] = rd.readShort();
    this.color[2] = rd.readShort();
    this.color[3] = rd.readShort();

    //闪烁完成时间
    this.flashTime = rd.readShort();
    //是否透明
    this.isOpactiy = rd.readBool();
    //不透明度
    this.opacity = rd.readShort();
    //透明完成时间
    this.opacityTime = rd.readShort();

    //是否缩放
    this.isZoom = rd.readBool();
    //缩放X坐标
    this.zoomX = rd.readShort();
    //缩放Y坐标
    this.zoomY = rd.readShort();
    //缩放完成时间
    this.zoomTime = rd.readShort();
    //是否角色闪烁
    this.isActorFlash = rd.readBool();
    this.actorColor[0] = rd.readShort();
    this.actorColor[1] = rd.readShort();
    this.actorColor[2] = rd.readShort();
    this.actorColor[3] = rd.readShort();
    //角色闪烁完成时间
    this.actorFlashTime = rd.readShort();


}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 粒子动画数据结构
 */
function DResAnimParticle(rd){
    //粒子文件组
    this.files = [];
    //动画ID
    this.id = rd.readShort();
    //动画名称
    this.name = rd.readString();
    //动画说明
    this.msg = rd.readString();
    //动画出现位置
    this.point = new DResAnimPoint(rd);

    //发射类型
    this.launchType = rd.readShort();
    //发射半径
    this.radius = rd.readShort();
    //是否拥有重力
    this.isGravity = rd.readBool();
    //区域宽度
    this.width = rd.readShort();
    //区域高度
    this.height = rd.readShort();
    //发射距离
    this.distance = rd.readShort();
    //发射方向
    this.dir = rd.readShort();
    //衰弱时间
    this.time = rd.readShort();
    //粒子数量
    this.number = rd.readShort();
    //储存结构文件
    this.file = rd.readString();

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.files.push(rd.readString());
    }
    //粒子音效
    this.sound = new DSetSound(rd);
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 动画显示位置数据结构
 */
function DResAnimPoint(rd){
    //位置类型，相对、绝对
    this.type = rd.readShort();
    //X坐标
    this.x = rd.readShort();
    //Y坐标
    this.y = rd.readShort();
    //相对方向
    this.dir = rd.readShort();

}/**
 * Created by 七夕小雨 on 2019/1/7.
 * 图块资源数据结构
 */
function DResBaseBlock(rd){
    //图块ID号
    this.id = rd.readShort();
    //绘制模式
    this.drawType = rd.readShort();
    //文件路径
    this.file = rd.readString();
    //名称
    this.name = rd.readString();
    //说明
    this.msg = rd.readString();
    //Z坐标
    this.z = rd.readShort();

    //陷入死亡
    this.mDie = rd.readBool();
    //阻力系数
    this.mNum = rd.readShort();

    var length = rd.readInt();
    //动画组
    this.anim = [];
    for(var i = 0;i<length;i++){
        this.anim.push(new DAnimRect(rd));
    }
}/**
 * Created by 七夕小雨 on 2019/1/7.
 * 配饰数据结构
 */
function DResDecorate(rd){
    //配饰ID
    this.id = rd.readShort();
    //配饰名称
    this.name = rd.readString();
    //文件
    this.file = rd.readString();
    //配饰动作类型
    this.type = rd.readShort();
    //动作时间
    this.time = rd.readInt();
    //是否是背景层的配饰
    this.isBack = rd.readBool();
    //动画组
    this.anim = [];
    var length = rd.readInt();
    for(var i = 0;i<length ;i++){
        this.anim.push(new DAnimRect(rd));
    }
}/**
 * Created by 七夕小雨 on 2019/1/7.
 * 场景资源数据结构
 */
function DResScene(rd){
    //图块组合
    this.blocks = [];
    //图块组合
    this.titles = [];

    //读取数据
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();
    this.background1 = new SecenBack(rd);
    this.background2 = new SecenBack(rd);

    var length = rd.readInt();
    for(var i = 0;i<length ;i++){
        var sb = new SceneBlock(rd);
        this.blocks.push(sb);
    }

    length = rd.readInt();
    for(i = 0;i<length;i++){
        this.titles.push(new SceneTile(rd));
    }

}
/**
 * 场景背景数据结构
 */
function SecenBack(rd){
    //文件
    this.file = rd.readString();
    //铺设类型
    this.type = rd.readShort();
}
/**
 * 场景基础图块数据结构
 */
function SceneBlock(rd){
    //图像资源ID
    this.id = rd.readShort();
    //图块基础逻辑类型 （基础块、滑行块、陷入块、死亡块）
    this.type = rd.readShort();
    //绘制优先级
    this.level = rd.readShort();
}
/**
 * 场景图块数据结构
 */
function SceneTile(rd){
    //对应文件
    this.file = rd.readString();
    //优先级
    this.mapLevel = [];

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        var k = rd.readString();
        var v = rd.readShort();
        this.mapLevel[k] = v;
    }

}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置的数据结构
 */
function DSet(onload){
    var onloadE = onload;

    //设置数据版本号
    this.code = 0;
    //总设
    this.setAll = null;
    //角色设置
    this.setActor = [];
    //交互块设置
    this.setBlock = [];
    //物品设置
    this.setItem = [];
    //武器设置
    this.setArms = [];
    //防具设置
    this.setArmor = [];
    //敌人设置
    this.setEnemy = [];
    //状态设置
    this.setState = [];
    //属性设置
    this.setAttribute = [];
    //技能设置
    this.setSkill = [];
    //子弹设置
    this.setBullet = [];
    //公共触发器
    this.setEvent = [];

    var _sf = this;

    //读取数据
    var rd = new IRWFile("Setting.ifset");
    rd.onload = function(){

        _sf.code = rd.readShort();
        _sf.setAll = new DSetAll(rd);
        var length = rd.readInt();
        for(var i = 0;i<length;i++){
            var temp = new DSetActor(rd);
            _sf.setActor[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetInteractionBlock(rd);
            _sf.setBlock[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetItem(rd);
            _sf.setItem[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetArms(rd);
            _sf.setArms[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetArmor(rd);
            _sf.setArmor[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetEnemy(rd);
            _sf.setEnemy[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetState(rd);
            _sf.setState[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetAttribute(rd);
            _sf.setAttribute[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetSkill(rd);
            _sf.setSkill[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetBullet(rd);
            _sf.setBullet[temp.id] = temp;
        }
        length = rd.readInt();
        for(i = 0;i<length;i++){
            temp = new DSetEvent(rd);
            _sf.setEvent[temp.id] = temp;
        }
        onloadE();
    };

    /**
     * 寻找属性设置
     * @param id
     * @returns {DSetAttribute}
     */
    this.findAttributeId = function(id){
        return _sf.setAttribute[id];
    };
    /**
     * 寻找公共触发器
     * @param id
     * @returns {DSetEvent}
     */
    this.findEventId = function(id){
        return _sf.setEvent[id];
    };

    /**
     * 寻找物品
     * @param id
     * @returns {DSetItem}
     */
    this.findItemId = function(id){
        return _sf.setItem[id];
    };

    /**
     * 通过ID号获得敌人的数据
     * @param id 敌人的数据
     * @returns {DSetEnemy}
     */
    this.findEnemyId = function(id){
        return _sf.setEnemy[id];
    };
    /**
     * 寻找武器
     * @param id
     * @returns {DSetArms}
     */
    this.findArmsId = function(id){
        return _sf.setArms[id];
    };
    /**
     * 寻找防具
     * @param id
     * @returns {DSetArmor}
     */
    this.findArmorId = function(id){
        return _sf.setArmor[id];
    };
    /**
     * 通过ID号获得技能的数据
     * @param id 敌人的数据
     * @returns {DSetSkill}
     */
    this.findSkillId = function(id){
        return _sf.setSkill[id];
    };
    /**
     * 寻找角色
     * @param id
     * @returns {DSetActor}
     */
    this.findActorId = function(id){
        return _sf.setActor[id];
    };
    /**
     * 寻找子弹
     * @param id
     * @returns {DSetBullet}
     */
    this.findBullet = function(id){
        return _sf.setBullet[id];
    };
    /**
     * 寻找交互块
     * @param id
     * @returns {DSetInteractionBlock}
     */
    this.findBlockId = function(id) {
        return _sf.setBlock[id];
    };
    /**
     * 寻找BUFF
     * @param id
     * @returns {DSetState}
     */
    this.findStateId = function(id){
        return _sf.setState[id];
    }

}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·角色数据结构
 */
function DSetActor(rd){
    //等级学习技能
    this.skills = [];

    //角色ID
    this.id = rd.readShort();
    //角色名称
    this.name = rd.readString();
    //角色攻击类型
    this.attackType = rd.readShort();
    //角色最小等级
    this.minLevel = rd.readShort();
    //角色最大等级
    this.maxLevel = rd.readShort();

    //角色对应资源ID
    this.actorId = rd.readShort();
    //默认子弹ID
    this.bulletAnimId = rd.readShort();

    //数值相关
    this.MaxHP = new Array(99);
    this.MaxMP = new Array(99);

    this.WAttack = new Array(99);
    this.WDefense = new Array(99);

    this.MAttack = new Array(99);
    this.MDefens = new Array(99);

    this.Speed = new Array(99);
    this.Luck = new Array(99);

    this.exp = new Array(99);

    //读取配置数值
    for (var i = 0; i < 99; i++) {
        this.MaxHP[i] = rd.readInt();
    }

    for (i = 0; i < 99; i++) {
        this.MaxMP[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.WAttack[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.WDefense[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.MAttack[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.MDefens[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.Speed[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.Luck[i] = rd.readInt();
    }

    for ( i = 0; i < 99; i++) {
        this.exp[i] = rd.readInt();
    }

    this.armsId = rd.readShort();
    this.shoesId = rd.readShort();
    this.armorId = rd.readShort();
    this.helmetId = rd.readShort();
    this.ornamentsId = rd.readShort();

    var length = rd.readInt();
    for ( i = 0; i < length; i++) {
        this.skills.push(new DSetActorSkill(rd));
    }

    length = rd.readInt();
    this.parts = {};
    for(i = 0;i<length;i++){
        var k = rd.readShort();
        var v = rd.readShort();
        this.parts[k] = v;
    }

    /**
     * 获得对应等级的基础数值
     * @param lv
     * @returns {{maxHp: ...*, luck: ...*, watk: ...*, maxExp: ...*, matk: ...*, wdef: ...*, maxMp: ...*, mdef: ...*, speed: ...*}}
     */
    this.getPowForLevel = function(lv){
        var level = lv - 1;
        if(level > 98){
            level = 98;
        }else if(level < 0){
            level = 0;
        }
        var obj ={
            maxHp : this.MaxHP[level],
            maxMp : this.MaxMP[level],
            watk  : this.WAttack[level],
            wdef  : this.WDefense[level],
            matk  : this.MAttack[level],
            mdef  : this.MDefens[level],
            speed : this.Speed[level],
            luck  : this.Luck[level],
            maxExp  : this.exp[level]
        };
        if(level >= 98){
            obj.maxExp = -1;
        }else{
            obj.maxExp = this.exp[level + 1];
        }
        return obj;
    }
}
/**
 * 角色学习技能数据结构
 */
function DSetActorSkill(rd){
    this.level = rd.readShort();
    this.skillId = rd.readShort();
}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·总设数据结构
 */
function DSetAll(rd){

    //按键映射
    this.key = new Array(30);
    //起始角色
    this.startActorID = rd.readShort();
    //角色死亡动画
    this.actorDieAnimID = rd.readShort();
    //角色升级动画
    this.actorLevelupAnimId = rd.readShort();
    //初始命数
    this.life = rd.readShort();
    //控制模式
    this.ctrlUpDown = rd.readShort();
    //自动移动
    this.autoMove = rd.readBool();
    //标题文件
    this.titleFile = rd.readString();
    //标题音乐
    this.titleMusic = new DSetSound(rd);
    //跳过标题
    this.skipTitle = rd.readBool();

    //跳跃初速度
    this.jumpSpeed = rd.readShort();
    //跳跃端数
    this.jumpTimes = rd.readShort();
    //跳跃音效
    this.jumpSound = new DSetSound(rd);

    //死亡块相关
    this.blockDieToDie = rd.readBool();
    this.blockDieType = rd.readShort();
    this.blockDieNum1 = rd.readShort();
    this.blockDieNum2 = rd.readShort();

    //拥有重力
    this.haveGravity = rd.readBool();
    //重力系数
    this.gravityNum = rd.readShort();


    //音效相关
    this.enterSound = new DSetSound(rd);
    this.cancelSound = new DSetSound(rd);
    this.selectSound = new DSetSound(rd);
    this.equipSound = new DSetSound(rd);
    this.injuredSound = new DSetSound(rd);

    for(var i = 0; i < 30;i++){
        this.key[i] = rd.readShort();
    }

    //UI显示相关
    this.uiHp = rd.readBool();
    this.uiLife = rd.readBool();
    this.uiMp = rd.readBool();
    this.uiExp = rd.readBool();
    this.uiMenu = rd.readBool();
    this.uiItems = rd.readBool();
    this.uiSkill = rd.readBool();
    this.uiPhone = rd.readBool();
    this.uiMoney = rd.readBool();

    this.parts = [];
    var length = rd.readInt();
    for(i = 0;i<length;i++){
        this.parts.push(rd.readString());
    }
    this.maxItems = rd.readShort();
    this.maxSkills = rd.readShort();
    this.talkUIid = rd.readInt();
    this.MsgUIid = rd.readInt();
    this.MsgIfid = rd.readInt();

    this.key2 = new Array(30);
    for(i = 0;i < 30;i++){
        this.key2[i] = rd.readShort();
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·防具数据结构
 */
function DSetArmor(rd){
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    this.icon = rd.readString();
    this.mainAttribute = rd.readShort();
    this.otherAttribute = rd.readShort();

    //防具类型
    this.type = rd.readShort();
    this.stateId = rd.readShort();
    this.stateTime = rd.readShort();

    //价格
    this.price = rd.readShort();
    //击退防御
    this.repel = rd.readShort();


    //属性相关
    this.maxHP = rd.readInt();
    this.maxMP = rd.readInt();
    this.watk = rd.readInt();
    this.wdef = rd.readInt();
    this.matk = rd.readInt();
    this.mdef = rd.readInt();
    this.speed = rd.readInt();
    this.luck = rd.readInt();


    //其他属性抵御
    this.useMp = rd.readBool();
    this.useMpValue = rd.readShort();
    this.useMoney = rd.readBool();
    this.useMoneyValue = rd.readShort();
    this.revive = rd.readBool();
    this.reviveHp = rd.readShort();
    this.reviveTime = rd.readShort();


    //状态防御
    this.cState = [];
    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·武器数据结构
 */
function DSetArms(rd){
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    this.icon = rd.readString();
    this.mainAttribute = rd.readShort();
    this.otherAttribute = rd.readShort();

    //武器类型
    this.type = rd.readShort();
    //远程武器子弹
    this.bulletId = rd.readShort();
    //武器攻击间隔
    this.atkInterval = rd.readShort();
    //武器攻击距离
    this.atkDistance = rd.readShort() / 100;
    //武器攻击命中后动画
    this.atkAnimId = rd.readShort();

    //价格
    this.price = rd.readShort();
    //击退
    this.repel = rd.readShort();

    //相关属性
    this.maxHP = rd.readInt();
    this.maxMP = rd.readInt();
    this.watk = rd.readInt();
    this.wdef = rd.readInt();
    this.matk = rd.readInt();
    this.mdef = rd.readInt();
    this.speed = rd.readInt();
    this.luck = rd.readInt();

    //吸血
    this.bloodSucking = rd.readShort();

    //状态改变
    this.cState = [];
    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·属性数据结构
 */
function DSetAttribute(rd){
    var _sf = this;

    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    //攻击率
    this.atk = [];
    //防御率
    this.def = [];
    var length = rd.readInt();

    for (var i = 0; i < length; i++) {
        this.atk[rd.readShort()] = rd.readShort();
    }
    length = rd.readInt();
    for (i = 0; i < length; i++) {
        this.def[rd.readShort()] = rd.readShort();
    }

    /**
     * 通过属性找到他的防御攻击率
     * @param attribute
     * @returns {{def: *, atk: *}}
     */
    this.getNum = function(attribute){
        var def = _sf.def[attribute.id];
        if(def == null){
            def = 0;
        }else{
            def /= 100;
        }
        var atk = _sf.atk[attribute.id];
        if(atk == null) {
            atk = 1;
        }else{
            atk /= 100;
        }
        return {
            atk : atk,
            def : def
        }
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·子弹数据结构
 */
function DSetBullet(rd){
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    //子弹是否使用图片
    this.userPic = rd.readBool();
    //子弹是否使用动画
    this.userAnim = rd.readBool();
    //子弹图片文件
    this.picFile = rd.readString();
    //子弹动画ID
    this.animId = rd.readShort();
    //子弹命中动画
    this.hitAnimId = rd.readShort();

    //是否拥有重力
    this.isGravity = rd.readBool();
    //是否跟踪
    this.isTrack = rd.readBool();
    //是否穿透
    this.isPenetration = rd.readBool();
    //子弹数量
    this.bulletNum = rd.readShort();
    //子弹速度
    this.bulletSpeed = rd.readShort();
    //子弹角度
    this.angle = rd.readShort();
    //子弹范围
    this.range = rd.readShort();
    //子弹存在时间
    this.time = rd.readShort();

}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·敌人数据结构
 */
function DSetEnemy(rd){
    //防御状态
    this.defState = [];
    //动作指令列表
    this.action = [];
    //掉落物品
    this.items = [];
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    //敌人图片ID
    this.picId = rd.readShort();
    //获得经验
    this.exp = rd.readInt();
    //获得金钱
    this.money = rd.readInt();
    //死亡后执行公共触发器
    this.evetId = rd.readShort();

    //攻击类型
    this.atkType = rd.readShort();
    //移动类型
    this.moveType = rd.readShort();

    //属性ID
    this.attributeId = rd.readShort();
    //副属性ID
    this.otherAttributeId = rd.readShort();
    //死亡动画
    this.dieAnimId = rd.readShort();
    //是否接触受到伤害
    this.isContactInjury = rd.readBool();
    //攻击击退
    this.atkRepel = rd.readShort();
    //攻击动画
    this.atkAnim = rd.readShort();
    //攻击距离
    this.atkDistance = rd.readShort() / 100;
    //远程子弹
    this.atkBullet = rd.readShort();
    //攻击间隔
    this.atkTime = rd.readShort();


    //移动速度
    this.moveSpeed = rd.readShort();

    //移动相关
    this.moveTarget = rd.readShort();
    this.isUpstairs = rd.readBool();
    this.isPenetrate = rd.readBool();
    this.isJump = rd.readBool();
    this.isSwerve = rd.readBool();

    this.isTeleporting = rd.readBool();
    this.isEntity = rd.readBool();

    //敌人数值
    this.maxHp = rd.readInt();
    this.maxMp = rd.readInt();
    this.WAtk = rd.readInt();
    this.WDef = rd.readInt();
    this.MAtk = rd.readInt();
    this.MDef = rd.readInt();
    this.Speed = rd.readInt();
    this.Luck = rd.readInt();



    var length = rd.readInt();
    for ( i = 0; i < length; i++) {
        this.items.push(new EnemyItem(rd));
    }

    length = rd.readInt();
    for ( i = 0; i < length; i++) {
        this.action.push(new EnemyAction(rd));
    }

    length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.defState[rd.readShort()] = rd.readShort();
    }

}
/**
 * 设置·敌人掉落物品数据结构
 */
function EnemyItem(rd){
    this.id = rd.readShort();
    //类型
    this.type = rd.readShort();
    //概率
    this.rate = rd.readShort();
}
/**
 * 设置·敌人动作数据结构
 */
function EnemyAction(rd){
    //动作类型
    this.IfType = rd.readShort();
    //数值1
    this.IfNum1 = rd.readShort();
    //数值2
    this.IfNum2 = rd.readShort();
    //数值3
    this.IfNum3 = rd.readInt();

    //权重
    this.rate = rd.readShort();

    //执行类型
    this.actionType = rd.readShort();
    //执行动作
    this.actionId = rd.readShort();
    //释放技能
    this.skillId = rd.readShort();

    //距离下一次
    this.nextTime = rd.readShort();

    //判定区域
    this.triggerX = rd.readShort();
    this.triggerY = rd.readShort();
    this.triggerWidth = rd.readShort();
    this.triggerHeight = rd.readShort();
}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·公共触发器
 */
function DSetEvent(rd){
    this.id = rd.readInt();
    this.name = rd.readString();

    //执行逻辑
    this.logic = new DIf(rd);
    //是否同步执行
    this.isParallel = rd.readBool();
    //是否自动执行
    this.autoRun = rd.readBool();

    //触发器内容
    this.events = [];

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        var et = new DEvent();
        et.read(rd);
        this.events.push(et);
    }

    /**
     * 执行触发器
     */
    this.doEvent = function(){
        if(this.logic.result()){
            //释放在地图的自动执行并行通用触发器
            if(this.autoRun && this.isParallel && !RF.FindOtherEvent("public_event_" + this.id)){
                RF.AddOtherEvent(this.events , "public_event_" + this.id , -1);
            }else if(!this.autoRun && this.isParallel){//通过物品、敌人死亡，怪物，或者在通用触发器中间执行的触发器
                RF.AddOtherEvent(this.events , null , -1);
            }else if(!this.isParallel){//合并在主循环执行的
                RV.InterpreterMain.addEvents(this.events);
            }
        }
    }
}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·交互块数据结构
 */
function DSetInteractionBlock(rd){
    //是否是物品交互块
    this.isItem = false;
    //可被放在在块内部
    this.isImplant = false;
    //拥有重力
    this.isGravity = true;
    //可穿透的
    this.isPenetrate = false;
    //拥有改变形态
    this.isStatus = false;
    //死亡块
    this.isDie = false;
    //可破坏
    this.isDestroy = false;
    //弹跳
    this.isJump = false;
    //消失
    this.isVanish = false;


    //增加金钱
    this.money = 0;
    //增加生命
    this.hpValue = 0;
    //增加法力
    this.mpValue = 0;
    //增加最大生命
    this.maxHpValue = 0;
    //增加最大法力
    this.maxMpValue = 0;
    //增加命数
    this.leftValue = 0;

    //读取数据

    this.id = rd.readShort();
    this.name = rd.readString();
    this.BlockId = rd.readShort();
    this.BlockId2 = rd.readShort();
    this.EventId = rd.readShort();

    this.animId = rd.readShort();
    this.actorAnimId = rd.readShort();

    this.isItem = rd.readBool();

    this.isGravity = rd.readBool();
    this.isPenetrate = rd.readBool();
    this.isStatus = rd.readBool();

    if (this.isItem) {
        this.money = rd.readInt();
        this.hpValue = rd.readInt();
        this.mpValue = rd.readInt();
        this.maxHpValue = rd.readInt();
        this.maxMpValue = rd.readInt();
        this.leftValue = rd.readInt();
    }else {
        this.isDie = rd.readBool();
        this.isDestroy = rd.readBool();
        this.isJump = rd.readBool();
        this.isVanish = rd.readBool();

        this.isImplant = rd.readBool();
    }

    this.cState = [];

    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·物品数据结构
 */
function DSetItem(rd){
    //物品ID
    this.id = rd.readShort();
    //物品名称
    this.name = rd.readString();
    //物品说明
    this.msg = rd.readString();
    //物品图标
    this.icon = rd.readString();
    //物品主属性
    this.mainAttribute = rd.readShort();
    //物品副属性
    this.otherAttribute = rd.readShort();

    //使用类型
    this.userType = rd.readShort();
    //使用动画
    this.userAnim = rd.readShort();
    //使用动作
    this.userAction = rd.readShort();
    //投射子弹
    this.bullet = rd.readShort();
    //设定区域
    this.triggerX = rd.readShort();
    this.triggerY = rd.readShort();
    this.triggerAnim = rd.readShort();
    this.triggerWidth = rd.readShort();
    this.triggerHeight = rd.readShort();

    //物品价格
    this.price = rd.readInt();
    //物品CD
    this.cd = rd.readInt();
    //公共触发器ID
    this.eventId = rd.readShort();
    //音效
    this.se = new DSetSound(rd);

    //不消耗
    this.noExpend = rd.readBool();
    //死亡后自动使用
    this.afterDeath = rd.readBool();
    //数值增加类型
    this.upType = rd.readShort();
    //数值增加量
    this.upValue = rd.readShort();
    //恢复生命与法力
    this.HpNum1 = rd.readShort();
    this.HpNum2 = rd.readInt();
    this.MpNum1 = rd.readShort();
    this.MpNum2 = rd.readInt();
    this.dispersed = rd.readShort();
    //状态改变
    this.cState = [];
    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 设置·技能数据结构
 */
function DSetSkill(rd){
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    //图标
    this.icon = rd.readString();
    this.mainAttribute = rd.readShort();
    this.otherAttribute = rd.readShort();

    //技能释放类型
    this.userType = rd.readShort();
    //技能动画
    this.userAnim = rd.readShort();
    //子弹
    this.bullet = rd.readShort();
    //子弹发射次数
    this.launchTimes = rd.readShort();
    //子弹发射间隔
    this.launchInterval  = rd.readShort();

    //技能判定区域
    this.triggerAnim = rd.readShort();
    this.triggerX = rd.readShort();
    this.triggerY = rd.readShort();
    this.triggerWidth = rd.readShort();
    this.triggerHeight = rd.readShort();

    //技能释放执行公共触发器
    this.eventId = rd.readShort();
    //消耗法力
    this.useMp = rd.readInt();

    //技能威力
    this.pow = rd.readInt();
    //技能CD
    this.cd = rd.readInt();
    //技能击退
    this.repel = rd.readShort();
    //技能击飞
    this.fly = rd.readShort();

    //技能相关数据
    this.maxHP = rd.readShort();
    this.maxMP = rd.readShort();
    this.Hp = rd.readShort();
    this.Mp = rd.readShort();
    this.watk = rd.readShort();
    this.wdef = rd.readShort();
    this.matk = rd.readShort();
    this.mdef = rd.readShort();
    this.speed = rd.readShort();
    this.luck = rd.readShort();

    this.dispersed = rd.readShort();

    //吟唱动画
    this.readyAction = rd.readShort();
    //施展动画
    this.doAction = rd.readShort();
    //等待技能结束
    this.waitOverSkill = rd.readBool();
    //锁定方向
    this.lockDirection = rd.readBool();
    //霸体
    this.superArmor = rd.readBool();
    //启动吸血
    this.bloodSucking = rd.readBool();
    //启用技能选择区域
    this.selectRect = rd.readBool();

    //位移
    this.moveTime = rd.readShort();
    this.moveX = rd.readShort();
    this.moveY = rd.readShort();

    //技能改变状态
    this.cState = [];
    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }

    this.rectAnim = rd.readShort();
}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 音效音乐数据结构
 */
function DSetSound(rd){
    //文件
    this.file = "";
    //音量
    this.volume = 80;

    if(rd != null){
        this.file = rd.readString();
        this.volume = rd.readShort();
    }

    /**
     * 播放
     * @param type 0、播放BGM 1、播放BGS 2、播放SE
     */
    this.play = function(type){
        if(this.file == "") return;
        if(type == null) type = 2;
        if(type == 0){
            RV.GameSet.playBGM("Audio/" + this.file , this.volume);
        }else if(type == 1){
            RV.GameSet.playBGS("Audio/" + this.file , this.volume);
        }else if(type == 2){
            RV.GameSet.playSE("Audio/" + this.file , this.volume);
        }
    }

}/**
 * Created by 七夕小雨 on 2019/3/14.
 * 总设·BUFF数据结构
 */
function DSetState(rd){
    this.id = rd.readShort();
    this.name = rd.readString();
    this.msg = rd.readString();

    //BUFF图标
    this.pic = rd.readString();
    //BUFF动画
    this.animID = rd.readShort();
    this.mainAttribute = rd.readShort();
    this.otherAttribute = rd.readShort();
    //BUFF限制
    this.limit = new DSetStateLimit(rd);

    //无法抵抗
    this.cantResist = rd.readBool() ;
    //无敌
    this.invincible = rd.readBool();
    //霸体
    this.superArmor = rd.readBool();

    //生命法力恢复相关
    this.cHpBool = rd.readBool();
    this.cHP = rd.readShort();
    this.cMpBool = rd.readBool();
    this.cMP = rd.readShort();
    this.cSpeedBool = rd.readBool();
    this.cSpeed = rd.readShort();
    this.cTimes = rd.readShort();

    //脱战后消失
    this.RelieveOutOfCombat = rd.readBool();
    //时间结束后消失
    this.RelieveTime = rd.readBool();
    //具体时间
    this.RTime = rd.readShort();
    //消耗生命结束
    this.RelieveHP = rd.readBool();
    //具体生命
    this.RHP = rd.readShort();
    //移动步数解锁
    this.RelieveMove = rd.readBool();
    //具体步数
    this.RMove = rd.readShort();

    //状态改变
    this.cState = [];
    var length = rd.readInt();
    for (var i = 0; i < length; i++) {
        this.cState[rd.readShort()] = rd.readShort();
    }

    //数值改变相关
    this.maxHP = rd.readInt();
    this.maxMP = rd.readInt();
    this.watk = rd.readInt();
    this.wdef = rd.readInt();
    this.matk = rd.readInt();
    this.mdef = rd.readInt();
    this.speed = rd.readInt();
    this.luck = rd.readInt();
    this.crit = rd.readInt();
    this.critF = rd.readInt();
    this.dodge = rd.readInt();
}
/**
 * 总设·BUFF限制数据结构
 */
function DSetStateLimit(rd){
    this.cantAtk = rd.readBool();
    this.cantSkill = rd.readBool();
    this.cantItem = rd.readBool();
    this.cantMove = rd.readBool();
    this.cantSquat = rd.readBool();
    this.cantJump = rd.readBool();
    this.cantOutOfCombat = rd.readBool();
}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 触发器数据结构
 */
function DTrigger(rd){
    //触发器ID
    this.id = 0;
    //触发器X坐标
    this.x = 0;
    //触发器Y坐标
    this.y = 0;
    //触发器名称
    this.name = "";
    //触发器内的触发器页
    this.page = [];

    //读取数据
    this.id = rd.readInt();
    this.x = rd.readInt();
    this.y = rd.readInt();
    this.name = rd.readString();

    var length = rd.readInt();
    for(var i = 0;i < length ; i++){
        var e = new DTriggerPage(rd);
        this.page.push(e);
    }

}

/**
 * 触发器触发页数据结构
 */
function DTriggerPage(rd){
    //触发类型
    this.type = 0;
    //循环执行
    this.loop = true;
    //是否异步执行
    this.isParallel = true;
    //触发页的表现图像对象
    this.image = null;
    //触发页的执行条件
    this.logic = null;
    //触发页的内容
    this.events = [];
    //重力
    this.gravity = 0;
    //穿透
    this.penetration = 0;

    //读取数据
    this.type = rd.readInt();
    this.loop = rd.readBool();
    this.isParallel = rd.readBool();
    this.gravity = rd.readInt();
    this.penetration = rd.readInt();

    this.image = new DTriggerImage(rd);
    this.logic = new DIf(rd);

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        var e = new DEvent(null);
        e.read(rd);
        this.events.push(e);
    }

}

/**
 * 触发器触发图像数据结构
 */
function DTriggerImage(rd){
    //图像ID 实际是DResActor对应的ID
    this.id = 0;
    //朝向
    this.dir = 0;
    //固定朝向
    this.fixedOrientation = false;
    //不透明度0~255
    this.opacity = 255;
    //动作索引
    this.actionIndex = 0;
    //固定动作
    this.fixedAction = false;

    this.id = rd.readShort();
    this.dir = rd.readShort();
    this.fixedOrientation = rd.readBool();
    this.opacity = rd.readShort();
    this.actionIndex = rd.readShort();
    this.fixedAction = rd.readBool();
    this.entity = rd.readBool();


}/**
 * Created by 七夕小雨 on 2019/1/4.
 * 变量的数据结构
 */
function DValue(rd){
    //变量ID
    this.id = rd.readInt();
    //变量名称
    this.name = rd.readString();
    //变量类型
    this.type = rd.readInt();
    //变量默认值
    this.defValue = rd.readString();
    //是否是多周目变量
    this.staticValue = rd.readBool();
}/**
 * Created by 七夕小雨 on 2019/3/14.
 *
 * 对外变量
 *
 * level     当前等级      只读
 * hp        当前生命      读写
 * mp        当前法力      读写
 * exp       当前经验      读写
 * maxExp    当前最大经验  读写
 * equips    当前装备      读写
 * skill     当前技能      读写
 * buff      当前buff      读写
 * levelUpDo 升级回调(lv)  读写
 *
 *
 * 对外函数
 *
 * void   -> init(data) 以data函数创建GActor data函数为DSetActor对象，可通过RV.NowSet.findActorId(id)获得
 * obj    -> save() 保存数据 返回值交给GMain保存
 * void   -> load() 读取数据 并为当前对象赋值
 * bool   -> studySkill(id) 学习 id为参数的技能 成功返回true，失败返回false
 * DSetActor -> getSetData() 获得当前角色配置数据
 * number -> getMaxHP() 获得当前最大HP
 * number -> getMaxMP() 获得当前最大MP
 * number -> getWAtk()  获得当前物理攻击
 * number -> getWDef()  获得当前物理防御
 * number -> getMAtk()  获得当前魔法攻击
 * number -> getMDef()  获得魔法防御
 * number -> getSpeed() 获得当前速度
 * number -> getLuck()  获得幸运值
 */

function GActor(){
    var _sf = this;
    //角色ID
    var actorId = 0;
    //角色等级
    var lv = 0;
    Object.defineProperty(this, "level", {
        get: function () {
            return lv;
        }
    });

    //角色当前HP
    var nowHp = 0;
    Object.defineProperty(this, "hp", {
        get: function () {
            return nowHp;
        },
        set: function (value) {
            if(value >= _sf.getMaxHP()){
                nowHp = _sf.getMaxHP();
            }else if(value <= 0){
                nowHp = 0;
                if(!RV.NowMap.getActor().isDie){
                    RV.NowMap.getActor().deathDo();
                }
            }else{
                nowHp = parseInt(value);
            }
            //复活
            if(RV.IsDie && RV.NowMap.getActor().isDie && nowHp > 0){
                RV.IsDie = false;
                RV.NowMap.getActor().isDie = false;
                RV.NowMap.getActor().getCharacter().getSpirte().stopAnim();
                RV.NowMap.getActor().getCharacter().getSpirte().pauseAnim();
                RV.NowMap.getActor().getCharacter().getSpirte().visible = true;
                RV.NowMap.getActor().getCharacter().getSpirte().opacity = 1.0;
                RV.NowMap.getActor().getCharacter().actionCall = null;
                RV.NowMap.getActor().getCharacter().setAction(0,false,false,false,true);
                RV.NowMap.getActor().invincible(2);
            }
        }
    });

    //角色当前MP
    var nowMp = 0;
    Object.defineProperty(this, "mp", {
        get: function () {
            return nowMp;
        },
        set: function (value) {
            if(value >= _sf.getMaxMp()){
                nowMp = _sf.getMaxMp();
            }else if(value <= 0){
                nowMp = 0;
            }else{
                nowMp = value;
            }
        }
    });

    //当前角色经验值
    var nowExp = 0;
    Object.defineProperty(this, "exp", {
        get: function () {
            return nowExp;
        },
        set: function (value) {
            if(value >= nowMaxExp && lv < setData.maxLevel){//升级
                var tempExp = value - nowMaxExp;
                _sf.levelUp(1,tempExp);
                _sf.hp = _sf.getMaxHP();
                _sf.mp = _sf.getMaxMp();
            }else if(value <= 0){
                nowExp -= value;
                if(nowExp < 0){
                    nowExp = 0;
                }
            }else{
                nowExp = value;
            }
            if(nowExp > nowMaxExp && lv < setData.maxLevel){
                _sf.exp = nowExp;
            }
        }
    });
    //角色最大经验值
    var nowMaxExp = 0;
    Object.defineProperty(this, "maxExp", {
        get: function () {
            return nowMaxExp;
        }
    });

    this.name = "";

    //角色当前装备
    this.equips = {};
    this.equips[-1] = 0;

    this.addPow = {
        maxHp : 0,
        maxMp :0,
        watk : 0,
        wdef :.0,
        matk :0,
        mdef : 0,
        speed : 0,
        luck : 0
    };
    //角色已习得技能
    this.skill = [];
    //角色当前buff
    this.buff = [];
    var setData = null;
    var powBase = {};
    var cacheEquip = null;
    var cacheDefBuff = [];
    this.levelUpDo = null;
    this.sumHp = 0;
    this.LAtk = false;
    this.LSkill = false;
    this.LItem = false;
    this.LMove = false;
    this.LSquat = false;
    this.LJump = false;
    this.LOutOfCombat = false;

    //初始化数据
    this.init = function(data){
        setData = data;
        actorId = data.id;
        lv = data.minLevel;
        powBase = data.getPowForLevel(this.level);

        nowExp = 0;
        nowMaxExp = powBase.maxExp;

        this.name = data.name;

        this.equips[-1]      = data.armsId;

        for(var i = 0;i<RV.NowSet.setAll.parts.length;i++){
            this.equips[i] = 0;
        }
        for(var eky in data.parts){
            this.equips[eky] = data.parts[eky];
        }

        nowHp = _sf.getMaxHP();
        nowMp = _sf.getMaxMp();

        _sf.skill = [];

        for(i = 0;i < data.skills.length;i++){
            if(lv >= data.skills[i].level){
                _sf.studySkill(data.skills[i].skillId);
            }
        }
    };

    /**
     * 替换角色数据
     * @param data
     */
    this.changeData = function(data,isInit){
        //遗忘旧职业技能
        for(var i = 0;i < setData.skills.length;i++){
            if(lv >= setData.skills[i].level){
                _sf.forgetSkill(setData.skills[i].skillId);
            }
        }
        for(i = 0;i<RV.GameData.userSkill.length;i++){
            RV.GameData.userSkill[i] = 0;
        }
        setData = data;
        actorId = data.id;
        if(isInit){
            lv = data.minLevel;
        }
        powBase = data.getPowForLevel(this.level);
        nowMaxExp = powBase.maxExp;
        RV.NowMap.getActor().atkType = setData.attackType;
        RV.NowMap.bulletId = _sf.getBulletAnimId();
        this.name = data.name;
        for(i = 0;i < data.skills.length;i++){
            if(lv >= data.skills[i].level){
                _sf.studySkill(data.skills[i].skillId);
            }
        }

    };
    /**
     * 保存游戏
     * @returns obj
     */
    this.save = function(){
        return {
            actorId : actorId,
            level : lv,
            hp : nowHp,
            mp : nowMp,
            exp : nowExp,
            name : this.name,
            equips : _sf.equips,
            skill : _sf.skill,
            addPow : _sf.addPow
        };
    };

    /**
     * 读取游戏
     * @param info
     */
    this.load = function(info){
        actorId = info.actorId;
        lv = info.level;
        nowHp = info.hp;
        nowMp = info.mp;
        nowExp = info.exp;

        this.name = info.name;

        this.equips = info.equips;
        this.skill = info.skill;
        this.addPow = info.addPow;

        setData = RV.NowSet.findActorId(actorId);
        powBase = setData.getPowForLevel(lv);
        nowMaxExp = powBase.maxExp;
    };

    /**
     * 装备
     * @param item 要装备的装备
     */
    this.equipLoad = function(item){
        if(item.type == 0) return;
        if(item.type == 1) {
            this.equipUnload(-1);
            this.equips[-1] = item.id;
            RV.GameData.useItem(item.id,1,1);
        }else if(item.type == 2){
            var data = RV.NowSet.findArmorId(item.id);
            if(data == null) return;
            this.equipUnload(data.type);
            this.equips[data.type] = data.id;
            RV.GameData.useItem(item.id,1,2);
        }

    };

    /**
     * 卸下装备
     * @param part 要卸下的部位
     */
    this.equipUnload = function(part){
        if(part == -1){
            var id = this.equips[-1];
            if(id > 0){
                RV.GameData.addItem(1 , id , 1);
                this.equips[-1] = 0;
            }
        }else{
            id = this.equips[part];
            if(id > 0){
                RV.GameData.addItem(2 , id , 1);
                this.equips[part] = 0;
            }
        }
    };

    /**
     * 学习技能
     * @param id 技能id
     * @returns {boolean} 是否学习成功
     */
    this.studySkill = function(id){
        var skill = RV.NowSet.findSkillId(id);
        if(skill != null && skill.icon != "" && this.skill.indexOf(id) < 0){
            this.skill.push(id);
            for(var i = 0; i< RV.GameData.actor.skill.length; i++){
                if(RV.GameData.userSkill.indexOf(RV.GameData.actor.skill[i]) == -1){
                    for(var j = 0; j< RV.NowSet.setAll.maxSkills; j++){
                        if(RV.GameData.userSkill[j] == 0){
                            RV.GameData.userSkill[j] = RV.GameData.actor.skill[i];
                            break
                        }
                    }
                }
            }
            return true;
        }
        return false;
    };

    /**
     * 遗忘技能
     * @param id
     */
    this.forgetSkill = function(id){
        var skill = RV.NowSet.findSkillId(id);
        if(skill == null || skill.icon == "") return;
        if(this.skill.indexOf(id) >= 0){
            this.skill.remove(id);
            var index = RV.GameData.userSkill.indexOf(id);
            if(index != -1) RV.GameData.userSkill[index] = 0;
        }
    };
    /**
     * 获得角色ID
     * @returns {number}
     */
    this.getActorId = function(){
        return actorId;
    };
    /**
     * 获得角色LActor对象
     * @returns {LActor| null}
     */
    this.getActor = function(){
        return RV.NowMap.getActor();
    };

    /**
     * 获取角色配置信息
     * @returns {DSetActor} setActor
     */
    this.getSetData = function(){
        return setData;
    };

    /**
     * 获得最大生命值
     * @returns {*} 最大生命值
     */
    this.getMaxHP = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].maxHP;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().maxHP;
        }
        return powBase.maxHp + _sf.addPow.maxHp + equipAdd + buffAdd;
    };
    /**
     * 获得最大法力值
     * @returns {*} 最大法力值
     */
    this.getMaxMp = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].maxMP;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().maxMP;
        }
        return powBase.maxMp + _sf.addPow.maxMp + equipAdd + buffAdd;
    };
    /**
     * 获得物理攻击
     * @returns {*} 物理攻击
     */
    this.getWAtk = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].watk;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().watk;
        }
        return powBase.watk + _sf.addPow.watk + equipAdd + buffAdd;
    };
    /**
     * 获得当前物理防御
     * @returns {*} 物理防御
     */
    this.getWDef = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].wdef;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().wdef;
        }
        return powBase.wdef + _sf.addPow.wdef + equipAdd + buffAdd;
    };
    /**
     * 获得魔法攻击
     * @returns {*} 魔法攻击
     */
    this.getMAtk = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].matk;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().matk;
        }
        return powBase.matk + _sf.addPow.matk + equipAdd + buffAdd;
    };
    /**
     * 获得当前魔法防御
     * @returns {*} 魔法防御
     */
    this.getMDef = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].mdef;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().mdef;
        }
        return powBase.mdef + _sf.addPow.mdef + equipAdd + buffAdd;
    };
    /**
     * 获得当前速度
     * @returns {*} 当前速度
     */
    this.getSpeed = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].speed;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().speed;
        }
        return powBase.speed + _sf.addPow.speed + equipAdd + buffAdd;
    };
    /**
     * 获得当前幸运值
     * @returns {*} 幸运值
     */
    this.getLuck = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 0;i<equips.length;i++){
            if(equips[i] != null) equipAdd += equips[i].luck;
        }
        var buffAdd = 0;
        for(i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().luck;
        }
        return powBase.luck + _sf.addPow.luck + equipAdd + buffAdd;
    };
    /**
     * 获得暴击率
     * @returns {number}
     */
    this.getAddCrit = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().crit;
        }
        return buffAdd;
    };
    /**
     * 获得暴击加成
     * @returns {number}
     */
    this.getAddCritF = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().critF;
        }
        return buffAdd;
    };
    /**
     * 获得闪避率
     * @returns {number}
     */
    this.getAddDodge = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().dodge;
        }
        return buffAdd
    };
    /**
     * 获得击退
     * @returns {number}
     */
    this.getRepel = function(){
        var arms = RV.NowSet.findArmsId(_sf.equips[-1]);
        if(arms == null) return 0;
        return arms.repel;
    };
    /**
     * 计算属性
     * @param id
     * @returns {{def: *, atk: *}|{def: number, atk: number}}
     */
    this.getAttribute = function(id){
        var arms = RV.NowSet.findArmsId(_sf.equips[-1]);
        if(arms == null) return {atk:1,def:0};
        var att = RV.NowSet.findAttributeId(arms.mainAttribute);
        if(att == null) return {atk:1,def:0};
        var eatt = RV.NowSet.findAttributeId(id);
        if(eatt == null) return {atk:1,def:0};
        var att2 = RV.NowSet.findAttributeId(arms.otherAttribute);
        if(att2 == null) return att.getNum(eatt);
        var obj1 = att.getNum(eatt);
        var obj2 = att2.getNum(eatt);
        return {
            atk : obj1.atk + Math.abs(obj2.atk / 2),
            def : obj1.def + Math.abs(obj2.def / 2)
        }

    };
    /**
     * 获得防御属性
     * @param id
     * @returns {{def: number, atk: number}}
     */
    this.getDefAttrbute = function(id){
        var eatt = RV.NowSet.findAttributeId(id);
        if(eatt == null) return {atk:1,def:0};
        var objs = [];
        for(var ekey in _sf.equips){
            if(ekey != -1){
                objs.push(getEquipAttbute(_sf.equips[ekey],eatt))
            }
        }
        var atk = 0;
        var def = 0;
        for(var i = 0;i<objs.length;i++){
            if(Math.abs(objs[i].atk) > atk){
                atk = objs[i].atk;
            }
            if(Math.abs(objs[i].def) > def){
                def = objs[i].def;
            }
        }
        return {
            atk : atk,
            def : def
        }
    };

    /**
     * 获得单个装备的属性
     * @param equipId
     * @param eatt
     * @returns {{def: *, atk: *}|{def: number, atk: number}}
     */
    function getEquipAttbute(equipId,eatt){
        var eq = RV.NowSet.findArmorId(equipId);
        if(eq == null) return {atk : 1,def : 0};
        var att = RV.NowSet.findAttributeId(eq.mainAttribute);
        if(att == null) return {atk:1,def:0};
        var att2 = RV.NowSet.findAttributeId(eq.otherAttribute);
        if(att2 == null) return att.getNum(eatt);
        var obj1 = att.getNum(eatt);
        var obj2 = att2.getNum(eatt);
        return {
            atk : obj1.atk + Math.abs(obj2.atk / 2),
            def : obj1.def + Math.abs(obj2.def / 2)
        }
    }

    /**
     * 获得子弹动画ID
     * @returns {number}
     */
    this.getBulletAnimId = function(){
        eachEquip();
        if(cacheEquip[0] == null){
            return setData.bulletAnimId;
        }else {
            return cacheEquip[0].bulletId;
        }
    };
    /**
     * 获得攻击距离
     * @returns {number}
     */
    this.getAtkDis = function(){
        eachEquip();
        if(cacheEquip[0] == null){
            return 1;
        }else{
            return cacheEquip[0].atkDistance;
        }

    };

    /**
     * 获得攻击间隔
     */
    this.getAtkWait = function(){
        eachEquip();
        if(cacheEquip[0] == null){
            return 35;
        }else{
            return cacheEquip[0].atkInterval;
        }
    };
    /**
     * 获得攻击附加BUFF
     * @returns {Array}
     */
    this.getAtkBuffs = function(){
        eachEquip();
        if(cacheEquip[0] == null){
            return [];
        }else{
            return cacheEquip[0].cState;
        }
    };

    /**
     * 获得MP抵消
     * @returns {number}
     */
    this.subMp = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 1;i<equips.length;i++){
            if(equips[i] != null && equips[i].useMp) {
                equipAdd += equips[i].useMpValue;
            }
        }
        return equipAdd;
    };
    /**
     * 获得金钱抵消伤害
     * @returns {number}
     */
    this.subMoney = function(){
        var equipAdd = 0;
        var equips = eachEquip();
        for(var i = 1;i<equips.length;i++){
            if(equips[i] != null && equips[i].useMoney) {
                equipAdd += equips[i].useMoneyValue;
            }
        }
        return equipAdd;
    };
    /**
     * 获得吸血
     * @returns {Array}
     */
    this.getbloodSucking = function(){
        if(cacheEquip[0] == null){
            return [];
        }else{
            return cacheEquip[0].bloodSucking;
        }
    };
    /**
     * 增加BUFF
     * @param id
     */
    this.addBuff = function(id){
        id = parseInt(id);
        var cof = RV.NowSet.findStateId(id);
        if(cof != null){

            var canAdd = true;
            if(!cof.cantResist && cacheDefBuff[id] != null){
                canAdd = !RF.ProbabilityHit(cacheDefBuff[id] / 100);
            }

            if(canAdd){
                var bf = new DBuff(cof,_sf);
                bf.endDo = function(){
                    _sf.buff.remove(bf);
                };
                _sf.buff.push(bf);
                //buff变化
                for(var mid in cof.cState){
                    if(cof.cState[mid] === 1){
                        RV.GameData.actor.addBuff(mid);
                    }else if(cof.cState[mid] === 2){
                        RV.GameData.actor.subBuff(mid);
                    }
                }
            }

        }
    };
    /**
     * 减少BUFF
     * @param id
     */
    this.subBuff = function(id){
        id = parseInt(id);
        for(var i = _sf.buff.length - 1;i>=0;i--){
            if(_sf.buff[i].getData().id === id){
                _sf.buff[i].endDo = null;
                _sf.buff[i].overBuff();
                _sf.buff.remove(_sf.buff[i]);
            }
        }
    };


    this.findBuff = function(id){
        for(var i = 0; i < _sf.buff.length;i++){
            if(_sf.buff[i].getData().id === id){
                return _sf.buff[i];
            }
        }
        return null;
    };

    /**
     * 更新BUFF
     */
    this.updateBuff = function(){
        for(var i = 0;i<_sf.buff.length;i++){
            _sf.buff[i].update();
        }
    };
    /**
     * 更新装备
     * @returns {Array}
     */
    this.updateEquip = function(){
        cacheEquip = [];
        cacheEquip.push(RV.NowSet.findArmsId(_sf.equips[-1]));
        for(var eKey in _sf.equips){
            if(eKey != -1){
                cacheEquip.push(RV.NowSet.findArmorId(_sf.equips[eKey]));
            }
        }
        if(RV.NowMap != null && RV.NowMap.getActor != null && RV.NowMap.getActor() != null){
            RV.NowMap.getActor().bulletId = _sf.getBulletAnimId();
            RV.NowMap.getActor().atkDis = _sf.getAtkDis();
            RV.NowMap.getActor().atkWait = _sf.getAtkWait();
        }
        cacheDefBuff = [];
        for(var i = 1;i<cacheEquip.length;i++){
            if(cacheEquip[i] != null) {
                for(var key in cacheEquip[i].cState){
                    if(cacheDefBuff[key] != null){
                        cacheDefBuff[key] += cacheEquip[i].cState[key];
                    }else{
                        cacheDefBuff[key] = cacheEquip[i].cState[key];
                    }

                }
            }
        }
        return cacheEquip;
    };
    /**
     * 升级
     * @param level
     */
    this.levelUp = function(level,overExp){
        nowExp = overExp == null ? 0 : overExp;
        var oldLv = lv;
        lv += level;
        if(lv > 99 ){
            lv = 99;
        }
        if(oldLv < 99){
            powBase = setData.getPowForLevel(lv);
            nowMaxExp = powBase.maxExp;
            RV.NowCanvas.playAnim(RV.NowSet.setAll.actorLevelupAnimId,null,RV.NowMap.getActor(),true);
            //技能学习
            for(var i = 0;i < setData.skills.length;i++){
                if(lv >= setData.skills[i].level){
                    _sf.studySkill(setData.skills[i].skillId);
                }
            }
            if(_sf.levelUpDo != null) _sf.levelUpDo(lv); //升级回调
        }
    };

    /**
     * 获得当前装备
     * @returns {*}
     */
    function eachEquip(){
        var equips = [];
        if(cacheEquip == null){
            equips = _sf.updateEquip();
        }else{
            equips = cacheEquip;
        }
        return equips;
    }

    /**
     * 释放内容
     */
    this.dispose = function(){
        for(var i = _sf.buff.length - 1;i>=0;i--){
            _sf.buff[i].dispose();
            _sf.buff.remove(_sf.buff[i]);
        }
    }

}
/**
 * GMain 游戏总数据
 * Created by 七夕小雨 on 2019/3/14.
 */
function GMain(){
    //角色数据信息
    this.actor = null;
    //命数
    this.life = 0;
    //变量
    this.value = [];
    //独立开关
    this.selfSwitch = [];
    //当前的地图Id
    this.mapId = 0;
    //当前x坐标
    this.x = 0;
    //当前y坐标
    this.y = 0;
    //当前朝向
    this.dir = 0;
    //金钱
    this.money = 0;
    //背包物品
    this.items = [];
    //快捷栏的技能
    this.userSkill = [0,0,0,0,0,0,0,0,0,0];
    //快捷栏的物品
    this.userItem = [0,0,0,0,0,0,0,0,0,0];
    //控制角色是否拥有重力
    this.isGravity = true;
    //重力系数
    this.gravityNum = 0;
    //跳跃系数
    this.jumpNum = 0;
    //跳跃段数
    this.jumpTimes = 0;
    //控制角色是否可穿透
    this.isCanPenetrate = false;
    //步数
    this.step = 0;
    //记怪器
    this.enemyIndex = 100000;
    //当前地图数据
    this.mapData = null;
    //当前菜单
    this.menu = 0;

    this.uiHp = RV.NowSet.setAll.uiHp;
    this.uiLife = RV.NowSet.setAll.uiLife;
    this.uiMp = RV.NowSet.setAll.uiMp;
    this.uiExp = RV.NowSet.setAll.uiExp;
    this.uiMenu = RV.NowSet.setAll.uiMenu;
    this.uiItems = RV.NowSet.setAll.uiItems;
    this.uiSkill = RV.NowSet.setAll.uiSkill;
    this.uiPhone = RV.NowSet.setAll.uiPhone;
    this.uiMoney = RV.NowSet.setAll.uiMoney;
    /**
     * 初始化游戏数据
     */
    this.init = function(){
        this.actor = new GActor();
        this.actor.init(RV.NowSet.findActorId(RV.NowSet.setAll.startActorID));
        var data = IRWFile.LoadKV(RV.NowProject.key);
        this.life = RV.NowSet.setAll.life;
        this.value = RV.NowProject.initValue(data != null ? data.value : null);
        this.mapId = RV.NowProject.startId;
        this.x = RV.NowProject.startX;
        this.y = RV.NowProject.startY;
        this.isGravity = RV.NowSet.setAll.haveGravity;
        this.gravityNum = RV.NowSet.setAll.gravityNum;
        this.jumpNum = RV.NowSet.setAll.jumpSpeed;
        this.jumpTimes = RV.NowSet.setAll.jumpTimes;
        this.isCanPenetrate = false;
        this.money = 0;
        this.items = [];
        this.selfSwitch = [];
        this.userSkill = [0,0,0,0,0,0,0,0,0,0];
        this.userItem = [0,0,0,0,0,0,0,0,0,0];
        this.enemyIndex = 100000;

        this.uiHp = RV.NowSet.setAll.uiHp;
        this.uiLife = RV.NowSet.setAll.uiLife;
        this.uiMp = RV.NowSet.setAll.uiMp;
        this.uiExp = RV.NowSet.setAll.uiExp;
        this.uiMenu = RV.NowSet.setAll.uiMenu;
        this.uiItems = RV.NowSet.setAll.uiItems;
        this.uiSkill = RV.NowSet.setAll.uiSkill;
        this.uiPhone = RV.NowSet.setAll.uiPhone;
        this.uiMoney = RV.NowSet.setAll.uiMoney;

    };


    /**
     * 保存游戏数据
     */
    this.save = function(){

        var nowActor = RV.NowMap.getActor();
        var point = nowActor.getXY();
        this.mapId = RV.NowMap.getData().id;
        this.x = point.x;
        this.y = point.y;
        this.dir = nowActor.getDir();

        var info = {
            actor : this.actor.save(),
            life : this.life,
            value : this.value,
            mapId : this.mapId,
            x : this.x,
            y : this.y,
            dir : this.dir,
            money : this.money,
            items : this.items,
            userSkill : this.userSkill,
            userItem : this.userItem,
            isGravity : this.isGravity,
            gravityNum : this.gravityNum,
            jumpNum : this.jumpNum,
            jumpTimes : this.jumpTimes,
            isCanPenetrate : this.isCanPenetrate,
            step : this.step,
            enemyIndex : this.enemyIndex,

            bgmFile : RV.GameSet.nowBGMFile,
            bgmVolume : RV.GameSet.nowBGMVolume,
            bgsFile : RV.GameSet.nowBGSFile,
            bgsVolume : RV.GameSet.nowBGSVolume,

            uiHp : this.uiHp,
            uiLife : this.uiLife,
            uiMp : this.uiMp,
            uiExp : this.uiExp,
            uiMenu : this.uiMenu,
            uiItems : this.uiItems,
            uiSkill : this.uiSkill,
            uiPhone : this.uiPhone,
            uiMoney : this.uiMoney,

            mapData : RV.NowMap.saveMap(),
            selfSwitch : this.selfSwitch

        };
        IRWFile.SaveKV(RV.NowProject.key,info);
    };

    /**
     * 读取游戏数据
     */
    this.load = function(){
        var info = IRWFile.LoadKV(RV.NowProject.key);
        if(info != null){
            this.actor = new GActor();
            this.actor.load(info.actor);
            this.life = info.life;
            //读取变量
            //this.value = RV.NowProject.initValue(null);
            //for(var key in info.value){
            //    this.value[key] = info.value[key];
            //}
            this.value = RV.NowProject.initValue(info.value);
            for(var key in info.value){
                this.value[key] = info.value[key];
            }
            this.mapId = info.mapId;
            this.x = parseInt(info.x / RV.NowProject.blockSize);
            this.y = parseInt(info.y / RV.NowProject.blockSize);
            this.dir = info.dir;
            this.money = info.money;
            this.userSkill = info.userSkill;
            this.isGravity = info.isGravity;
            this.gravityNum = info.gravityNum;
            this.jumpNum = info.jumpNum;
            this.jumpTimes = info.jumpTimes;
            this.isCanPenetrate = info.isCanPenetrate;
            this.step = info.step;
            this.enemyIndex = info.enemyIndex;
            //复原物品
            this.items = [];
            this.userItem = [0,0,0,0,0,0,0,0,0,0];
            for(var i = 0;i<info.items.length;i++){
                this.items.push(new DBagItem(info.items[i].type,info.items[i].id,info.items[i].num))
            }
            for(i = 0;i<info.userItem.length;i++){
                if(info.userItem[i] != 0 && info.userItem[i].num > 0){
                    this.userItem[i] = this.findItem(info.userItem[i].type,info.userItem[i].id);
                }else{
                    this.userItem[i] = 0;
                }
            }
            //复原BGM，BGS
            RV.GameSet.playBGM(info.bgmFile,info.bgmVolume);
            RV.GameSet.playBGS(info.bgsFile,info.bgsVolume);
            //复原UI显示
            this.uiHp = info.uiHp === true;
            this.uiLife = info.uiLife === true;
            this.uiMp = info.uiMp === true;
            this.uiExp = info.uiExp === true;
            this.uiMenu = info.uiMenu === true;
            this.uiItems = info.uiItems === true;
            this.uiSkill = info.uiSkill === true;
            this.uiPhone = info.uiPhone === true;
            this.uiMoney = info.uiMoney === true;

            this.mapData = info.mapData;

            this.selfSwitch = info.selfSwitch;

            return true;
        }

        return false;

    };

    this.getMapData = function(){
        return this.mapData;
    };

    this.clearMapData = function(){
        this.mapData = null;
    };


    /**
     * 添加物品
     * @param type  物品类型 0 物品 1 武器 2防具
     * @param id    物品Id
     * @param num   物品数量
     */
    this.addItem = function(type , id , num){
        var item = new DBagItem(type , id , num);
        if(item.findData() == null || item.findData().icon == "") return;
        var have = false;
        for(var i = 0; i < this.items.length ; i++){
            if(this.items[i].type == type && this.items[i].id == id){
                this.items[i].num += num;
                if(this.items[i].num > 99){
                    this.items[i].num = 99;
                }
                if(this.items[i].num <= 0){
                    this.items.splice(i, 1);
                }
                have = true;

            }
        }
        if(!have && num > 0){
            this.items.push(item);
        }
        var tempItemId = [];
        for(i = 0; i< RV.GameData.userItem.length; i++){
            if(RV.GameData.userItem[i] != 0 && RV.GameData.userItem[i].type == type)tempItemId.push(RV.GameData.userItem[i].id)
        }
        if(tempItemId.indexOf(item.id) == -1){
            for(i = 0; i< RV.NowSet.setAll.maxItems; i++){
                if(RV.GameData.userItem[i] == 0){
                    RV.GameData.userItem[i] = item;
                    break
                }
            }
        }
    };
    /**
     * 丢去物品
     * @param item
     * @param num
     * @returns {boolean}
     */
    this.discardItem = function(item,num){
        for(var i = 0; i < this.items.length ; i++){
            if(this.items[i].type == item.type && this.items[i].id == item.id){
                this.items[i].num -= num;
                if(this.items[i].num <= 0){
                    this.items.splice(i, 1);
                }
                return true;
            }
        }
    };

    /**
     * 使用物品
     * @param id 物品id
     * @param num 物品数量
     * @param type 物品类型
     * @returns {boolean} 是否使用成功
     */
    this.useItem = function(id,num,type){
        if(this.actor.LItem) return false;
        var tp = type == null ? 0 : type;
        for(var i = 0;i<this.items.length;i++){
            if(this.items[i].type == tp && this.items[i].id == id && this.items[i].num >= num){
                if(tp == 0 && this.items[i].user(num)){
                    var cof = this.items[i].findData();
                    if(cof != null && cof.noExpend){//不消耗
                        return true;
                    }
                    this.items[i].num -= num;
                    if(this.items[i].num <= 0){
                        this.items.splice(i, 1);
                    }
                    return true;
                }else if(tp != 0){
                    this.items[i].num -= num;
                    if(this.items[i].num <= 0){
                        this.items.splice(i, 1);
                    }
                    return true;
                }
                return false;
            }
        }
        return false;
    };
    /**
     * 查找物品
     * @param type 物品类型
     * @param id 物品ID
     * @returns {null|*}
     */
    this.findItem = function(type,id){
        for(var i = 0;i<this.items.length;i++){
            if(this.items[i].type == type && this.items[i].id == id){
                return this.items[i];
            }
        }
        return null;
    };
    /**
     * 物品分类
     * @param type 物品类型
     * @param part 物品部位
     * @returns {null|*}
     */
    this.sortItems = function(type,part){
        var items = [];
        if(type == -1){//全部
            items = this.items;
        }else{
            for(var i = 0; i<this.items.length; i++){
                if(type == 0){//物品
                    if(this.items[i].type == 0){
                        items.push(this.items[i])
                    }
                }else if(type == 1){//武器
                    if(this.items[i].type == 1){
                        items.push(this.items[i])
                    }
                }else if (type == 2){//防具
                    if(part != null){
                        if(this.items[i].type == 2 && this.items[i].findData().type == part){
                            items.push(this.items[i])
                        }
                    }else{
                        if(this.items[i].type == 2){
                            items.push(this.items[i])
                        }
                    }
                }
            }
        }
        return items;
    };

    /**
     * 获得变量对应值
     * @param id 变量ID
     * @returns {string|*}
     */
    this.getValues = function(id){
        var val = this.value[id];
        if(val === true || val === false){
            return val ? "ON" : "OFF";
        }else if(!isNaN(val)){
            return val;
        }else if(typeof(val)=='string'){
            var str = val.replaceAll("\\\\[Vv]\\[([a-zA-Z0-9-_]+)]",CharToAScII(60003)+  "[$1]");
            var end = "";
            while(true){
                if(str.length <= 0){
                    break;
                }
                var min = str.substring(0,1);
                str = str.substring(1,str.length);
                var c = min.charCodeAt(0);
                if(c == 60003){
                    var returnS = TextToTemp(str , "[","]","\\[([a-zA-Z0-9-_]+)]");
                    str = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
                }else{
                    end += min;
                }
            }
            return end;
        }
        return "null";
    };

    /**
     * 文字正则提取
     * @param mainText 需要提取的字符串
     * @param s 前置特殊标志
     * @param e 后置特殊标志
     * @param rex 正则表达式
     * @returns {*[]} 提取后的内容
     */
    function TextToTemp( mainText, s, e, rex){
        var tmp = mainText.substring(mainText.indexOf(s) + 1,mainText.indexOf(e));
        mainText = mainText.substring(tmp.length + s.length + e.length, mainText.length);
        var temp1 = tmp.replaceAll(rex, "$1");
        var temp_2 = temp1.replaceAll(" ", "");
        var temp_e = temp_2.replaceAll("，", ",");
        return [temp_e,mainText];
    }

    /**
     * char转换AscII
     * @param num char码
     * @returns {string}
     */
    function CharToAScII( num) {
        return String.fromCharCode(num);
    }

    /**
     * 获得变量对象
     * @param id 变量ID
     * @param value 如果变量为空值，设置一个默认变量
     * @returns {*}
     */
    this.getValue = function(id , value){
        var val = this.value[id];
        if(val == null){
            return value;
        }
        return val;
    };

    /**
     * 获得变量
     * @param id 变量ID
     * @param value 如果变量为空值，设置一个默认变量
     * @returns {*}
     */
    this.getValueNum = function(id,value){
        var val = this.value[id];
        if(val == null){
            return value;
        }
        if(!isNaN(val)){
            return val;
        }
        return value;
    }

}


/**
 * 是否有存档；
 * @returns {boolean}
 */
GMain.haveFile = function(){
    var data = IRWFile.LoadKV(RV.NowProject.key);
    return data != null;
};/**
 * Created by 七夕小雨 on 2019/6/12 0012.
 * 游戏设定部分
 */
function GSet(){
    var _sf = this;
    //当前播放的BGM文件
    this.nowBGMFile = "";
    //当前播放的BGS文件
    this.nowBGSFile = "";
    //当前BGM音量
    this.nowBGMVolume = 100;
    //当前BGS音量
    this.nowBGSVolume = 100;

    //相对音乐音量
    var musicVolume = 100;
    //相对音效音量
    var soundVolume = 100;

    //修改音乐音量
    Object.defineProperty(this, "BGMVolume", {
        get: function () {
            return musicVolume;
        },
        set:function(value){
            musicVolume = value;
            _sf.setBGMVolume(_sf.nowBGMVolume * (musicVolume / 100));
            _sf.setBGSVolume(_sf.nowBGSVolume * (musicVolume / 100));
        }
    });
    //修改音效音量
    Object.defineProperty(this, "SEVolume", {
        get: function () {
            return soundVolume;
        },
        set:function(value){
            soundVolume = value;
        }
    });

    /**
     * 保存设置
     */
    this.save = function(){
        var info = {
            mv : musicVolume,
            sv : musicVolume
        };
        IRWFile.SaveKV(RV.NowProject.key + "_gameinfo",info);
    };
    /**
     * 读取设置
     */
    this.load = function(){
        var info = IRWFile.LoadKV(RV.NowProject.key + "_gameinfo");
        if(info != null){
            musicVolume = info.mv;
            soundVolume = info.sv;
        }
    };

    /**
     * 播放BGM
     * @param file 文件
     * @param volume 音量
     */
    this.playBGM = function(file,volume){
        _sf.nowBGMFile = file;
        _sf.nowBGMVolume = volume;
        if(_sf.nowBGMFile.length > 0){
            IAudio.playBGM(file , parseInt(volume * (musicVolume / 100)));
        }
    };

    /**
     * 播放BGS
     * @param file 文件
     * @param volume 音量
     */
    this.playBGS = function(file,volume){
        _sf.nowBGSFile = file;
        _sf.nowBGSVolume = volume;
        if(_sf.nowBGSFile.length > 0){
            IAudio.playBGS(file , parseInt(volume * (musicVolume / 100)));
        }
    };

    /**
     * 设置BGM音量
     * @param volume
     */
    this.setBGMVolume = function(volume){
        if(_sf.nowBGMFile.length > 0){
            IAudio.playBGM(_sf.nowBGMFile , parseInt(volume));
        }
    };

    /**
     * 设置BGS音量
     * @param volume
     */
    this.setBGSVolume = function(volume){
        if(_sf.nowBGSFile.length > 0){
            IAudio.playBGS(_sf.nowBGSFile , parseInt(volume));
        }
    };

    /**
     * 播放SE
     * @param file 文件
     * @param volume 音量
     */
    this.playSE = function(file,volume){
        IAudio.playSE(file,volume * (soundVolume / 100));
    };

    //播放确认音效
    this.playEnterSE = function(){
        if(RV.NowSet.setAll.enterSound.file.length < 0) return;
        _sf.playSE("Audio/" + RV.NowSet.setAll.enterSound.file , RV.NowSet.setAll.enterSound.volume);
    };

    //播放取消音效
    this.playCancelSE = function(){
        if(RV.NowSet.setAll.cancelSound.file.length < 0) return;
        _sf.playSE("Audio/" + RV.NowSet.setAll.cancelSound.file , RV.NowSet.setAll.cancelSound.volume);
    };

    //播放装备音效
    this.playEquipSE = function(){
        if(RV.NowSet.setAll.equipSound.file.length < 0) return;
        _sf.playSE("Audio/" + RV.NowSet.setAll.equipSound.file , RV.NowSet.setAll.equipSound.volume);
    };

    //播放受伤音效
    this.playInjuredSE = function(){
        if(RV.NowSet.setAll.injuredSound.file.length < 0) return;
        _sf.playSE("Audio/" + RV.NowSet.setAll.injuredSound.file , RV.NowSet.setAll.injuredSound.volume);
    };

    //播放选择音效
    this.playSelectSE = function(){
        if(RV.NowSet.setAll.selectSound.file.length < 0) return;
        _sf.playSE("Audio/" + RV.NowSet.setAll.selectSound.file , RV.NowSet.setAll.selectSound.volume);
    };



}/**
 * Created by 七夕小雨 on 2018/7/3.
 * 解释器基础结构
 */
function IEventBase(){
    //初始化
    this.init = function(){
        return false
    };
    //循环
    this.update = function(){
        return false
    };
    //结束
    this.finish = function(){
        return true
    };
    //检测是否结束
    this.isFinish = function(){
        return this.finish()
    }
}

//静态事件队列
function IM(){}/**
 * Created by 七夕小雨 on 2018/2/26.
 * 触发器转译
 */
function IList(){
    //制作执行器
    this.MakeEvent = function( e, m) {
        if(e == null) return null;
        switch (e.code) {
            case 101: //显示对话
                return new IM.Talk(e,m);
            case 102://显示文本
                return new IM.Message(e,m);
            case 103://显示选项
                return new IM.TextChoice(e,m);
            case 104://显示提示
                return new IM.Tips(e,m);
            case 105://显示选择框
                return new IM.MessageBox(e,m);
            case 106://关闭对话
                return new IM.CloseTalk(e,m);
            case 107://关闭文本
                return new IM.CloseMessage(e,m);
            case 201: //等待
                return new IM.Wait(e,m);
            case 202: //变量
                return new IM.Value(e,m);
            case 203: //条件分歧
                return new IM.IF(e,m);
            case 204: //循环
                return new IM.Loop(e,m);
            case 2041://以上反复
                return new IM.LoopUp(e,m);
            case 205://跳出循环
                return new IM.LoopBreak(e,m);
            case 206://执行公共触发器
                return new IM.Event(e,m);
            case 207://地图移动
                return new IM.MapMove(e,m);
            case 208://游戏结束
                return new IM.GameOver(e,m);
            case 209://游戏胜利
                return new IM.GameWin(e,m);
            case 210://跳转触发器
                return new IM.TriggerMove(e,m);
            case 211://独立开关
                return new IM.SelfSwitch(e,m);
            case 301://画面闪烁
                return new IM.Flash(e,m);
            case 302 ://画面震动
                return new IM.Shack(e,m);
            case 303: //画面遮罩进入
                return new IM.MaskIn(e,m);
            case 304://画面遮罩淡出
                return new IM.MakeOut(e,m);
            case 305://天气
                return new IM.Weather(e,m);
            case 306://图片显示
                return new IM.PicShow(e,m);
            case 307://图片移动
                return new IM.PicMove(e,m);
            case 308://图片删除
                return new IM.PicDel(e,m);
            case 309://移动摄像机
                return new IM.ViewMove(e,m);
            case 310://摄像机复位
                return new IM.ViewReset(e,m);
            case 311://播放动画
                return new IM.ShowAnim(e,m);
            case 312://停止动画
                return new IM.StopAnim(e,m);
            case 401://触发器/角色移动
                return new IM.EventAction(e,m);
            case 402://增加角色数值
                return new IM.AddActorValue(e,m);
            case 403://更改HP MP
                return new IM.ChangeHPMP(e,m);
            case 404://学习、遗忘技能
                return new IM.ChangeSkill(e,m);
            case 405://更改BUFF
                return new IM.ChangeBuff(e,m);
            case 406://更改角色
                return new IM.ChangeActor(e,m);
            case 407://更改装备
                return new IM.ChangeEquip(e,m);
            case 408://更改跳跃次数
                return new IM.ChangeJumpNum(e,m);
            case 409://更改重力
                return new IM.ChangeGravity(e,m);
            case 410://更改跳跃速度
                return new IM.ChangeJumpSpeed(e,m);
            case 411://设置交互块移动
                return new IM.BlockAction(e,m);
            case 412://设置敌人属性
                return new IM.SetEnemy(e,m);
            case 413://为敌人设置BOSS血条
                return new IM.BossBar(e,m);
            case 414://增加敌人
                return new IM.addEnemy(e,m);
            case 415://设置角色图层
                return new IM.SetActorLevel(e,m);
            case 501: //播放背景音乐
                return new IM.BGMPlay(e,m);
            case 502: //播放背景音效
                return new IM.BGSPlay(e,m);
            case 503: //播放音效
                return new IM.SEPlay(e,m);
            case 504: //淡出背景音乐
                return new IM.BGMFade(e,m);
            case 505: //淡出背景音效
                return new IM.BGSFade(e,m);
            case 506: //停止音效
                return new IM.SEStop(e,m);
            case 601://呼叫商店
                return new IM.Shop(e,m);
            case 602://显示菜单
                return new IM.ShowMenu(e,m);
            case 603://增加金钱
                return  new IM.Money(e,m);
            case 604://保存游戏
                return new IM.SaveGame(e,m);
            case 605://读取游戏
                return new IM.LoadGame(e,m);
            case 606://执行脚本
                return new IM.Script(e,m);
            case 607://增加物品
                return new IM.AddItems(e,m);
            case 608://显示/隐藏主界面ui
                return new IM.mainUI(e,m);
            case 609://呼叫自定义UI
                return new IM.callSelfUI(e,m);
            case 701://移动UI
                return new IM.UIMove(e,m);
            case 702://消除UI
                return new IM.UIDisposeCtrl(e,m);
            case 703://消除全部
                return new IM.UIDisposeAll(e,m);
            case 704://更改选项
                return new IM.UICheckIndex(e,m);
            case 705://更改图片
                return new IM.UIPic(e,m);
            case 706://更改自动图片尺寸
                return new IM.UIAutoPicSize(e,m);
            case 707://更改文字
                return new IM.UITextChange(e,m);
            case 708://更改筛选条件
                return new IM.UIChangeIF(e,m);
            case 709:
                return new IM.UICloseUI(e,m);
            case 710:
                return new IM.UIAngel(e,m);
            case -32286: //mod扩展事件
                if(IVal.Mods != null){
                    //取出第一个参数作为Key值
                    var key = e.args[0].split('Φ');
                    var mod = IVal.Mods.findMod(key[0]);
                    if(mod.trigger.hasOwnProperty(key[1])){
                        return eval("new " + mod.trigger[key[1]] + "(e,m)");
                    }

                }else{
                    return null;
                }
            default:
                return null;
        }
    }
}/**
 * Created by 七夕小雨 on 2019/3/17.
 */
IM.Talk = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        var name = "";
        var id = parseInt(event.args[0]);
        if(event.args[0] == "-20"){
            id =  main.NowEventId;
        }
        if(event.args[1] == "1"){
            if(event.args[0] == "-10"){
                name = RV.GameData.actor.name;
            }else{
                var et = RV.NowMap.findEvent(id);
                if(et != null){
                    name = et.name;
                }
            }
        }else{
            name = event.args[2];
        }
        RV.NowCanvas.pop.talk(name , event.args[3],id);

        return false;
    };

    this.isFinish = function(){
        if(RV.NowCanvas.pop.isNext){
            RV.NowCanvas.pop.none();
            return true;
        }else if(!RV.NowCanvas.pop.isShowing() && RF.IsNext() ){
            RV.NowCanvas.pop.none();
            return true;
        }
        return false;
    };
};


IM.Message = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        RV.NowCanvas.message.setThis(event.args[1] == "1" , parseInt(event.args[0]));
        RV.NowCanvas.message.talk(event.args[2],event.args[3]);
        return false;
    };

    this.isFinish = function(){
        if(RV.NowCanvas.message.isNext){
            RV.NowCanvas.message.re();
            return true;
        }else if(!RV.NowCanvas.message.isShowing() && RF.IsNext() ){
            RV.NowCanvas.message.re();
            return true;
        }
        return false;
    };
};

IM.TextChoice = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        RV.NowCanvas.choice.setupChoice(event.args , 1000);
        return false;
    };

    this.finish = function(){
        var index = RV.NowCanvas.choice.index;
        main.insertEvent(event.events[index].events);
    };

    this.isFinish = function(){
        return !RV.NowCanvas.choice.isW;
    };
};

IM.Tips = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        RF.ShowTips(event.args[0]);
        return false;
    };
};

IM.MessageBox = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var index = -1;

    this.init = function(){
        var msg = RF.MakerValueText(event.args[0]);
        var endMsg = msg.replaceAll("\\\\","\\\\") + "||" + event.args[1] + "||" + event.args[2];
        var ui =  RV.NowUI.uis[13];
        var sui = null;
        if(main.ui == null){
            if(ui != null && IVal.scene instanceof  SMain){
                sui = IVal.scene.initSelfUI(ui,"\"" + endMsg + "\"");
            }
        }else{
            sui = main.ui.showChildfUI(ui,"\"" + endMsg + "\"");
        }
        if(sui != null){
            var oldEnd = sui.endDo;
            sui.endDo = function(e){
                index = e;
                oldEnd();
            }
        }else{
            index = 1;
        }
        return false;
    };

    this.finish = function(){
        if(event.events.length - 1 >= index){
            main.insertEvent(event.events[index].events);
        }
    };

    this.isFinish = function(){
        return index >= 0;
    };
};

IM.CloseTalk = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        RV.NowCanvas.pop.none();
        return false;
    };
};

IM.CloseMessage = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        RV.NowCanvas.message.re();
        return false;
    };
};/**
 * Created by 七夕小雨 on 2019/3/18.
 */
IM.Wait = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var wait = 0;

    this.init = function(){
        wait = parseInt(event.args[0]);
        if(wait >= 30){
            RV.NowCanvas.message.re();
        }
        return false;
    };

    this.update = function(){
        wait -= 1
    };

    this.isFinish = function(){
        return wait <= 0
    };

};


IM.Value = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var index1 = parseInt(event.args[0]);
        var val = RV.GameData.value[index1];
        var val2 = null;
        if(val != null){
            if(val === true || val === false){
                if(event.args[1] == "0"){
                    RV.GameData.value[index1] = event.args[2] == "1";
                }else if(event.args[1] == "1"){
                    val2 = RV.GameData.value[parseInt(event.args[2])];
                    if(val2 != null){
                        RV.GameData.value[index1] = val2;
                    }
                }else if(event.args[1] == "2"){
                    val2 = RV.GameData.value[parseInt(event.args[2])];
                    if(val2 != null){
                        RV.GameData.value[index1] = !val2;
                    }
                }
            }else if(typeof(val)=='string'){
                RV.GameData.value[index1] = event.args[1];
            }else if(!isNaN(val)){
                if(event.args[2] == "0"){
                    val2 = parseInt(event.args[3]);
                }else if(event.args[2] == "1"){
                    val2 = RV.GameData.value[parseInt(event.args[3])];
                }else if(event.args[2] == "2"){
                    val2 = rand(parseInt(event.args[3]),parseInt(event.args[4]))
                }else if(event.args[2] == "3"){
                    val2 = makeGameDataText(parseInt(event.args[3]),parseInt(event.args[4]),parseInt(event.args[5]));
                }
                RV.GameData.value[index1] = Calculation(parseInt(event.args[1]),RV.GameData.value[index1],val2);
            }
        }
        return false;
    };

    function makeGameDataText(type, s1, s2) {
        var val = 0;
        if (type == 0) {
            var bag = RV.GameData.findItem(0,s1);
            if(bag != null){
                return bag.num;
            }
        } else if (type == 1) {
            bag = RV.GameData.findItem(1,s1);
            if(bag != null){
                return bag.num;
            }
        } else if (type == 2) {
            bag = RV.GameData.findItem(2,s1);
            if(bag != null){
                return bag.num;
            }
        } else if (type == 3) {
            if(s1 == 0){
                return RV.GameData.actor.getMaxHP();
            }else if(s1 == 1){
                return RV.GameData.actor.getMaxMp();
            }else if(s1 == 2){
                return RV.GameData.actor.hp;
            }else if(s1 == 3){
                return RV.GameData.actor.mp;
            }else if(s1 == 4){
                return RV.GameData.actor.getWAtk();
            }else if(s1 == 5){
                return RV.GameData.actor.getWDef();
            }else if(s1 == 6){
                return RV.GameData.actor.getMAtk();
            }else if(s1 == 7){
                return RV.GameData.actor.getMDef();
            }else if(s1 == 8){
                return RV.GameData.actor.getSpeed();
            }else if(s1 == 9){
                return RV.GameData.actor.getLuck();
            }else if(s1 == 10){
                return RV.GameData.actor.level;
            }
        } else if (type == 4) {
            var rect = null;
            var et = null ;
            if (s1 == -10) {
                et = RV.NowMap.getActor();
                rect = RV.NowMap.getActor().getCharacter().getCharactersRect();
            } else if (s1 == -20) {
                et = RV.NowMap.findEvent(main.NowEventId);
                if(et != null){
                    rect = et.getRect();
                }

            } else {
                et = RV.NowMap.findEvent(s1);
                if(et != null){
                    rect = et.getRect();
                }
            }
            if (s2 == 0) {
                if(rect != null){
                    return parseInt(rect.centerX / RV.NowProject.blockSize);
                }

            } else if (s2 == 1) {
                if(rect != null){
                    return parseInt((rect.bottom - RV.NowProject.blockSize) / RV.NowProject.blockSize);
                }
            } else if (s2 == 2) {
                if(et != null){
                    return et.getDir();
                }
            }
        } else if (type == 5) {
            if (s1 == 0) {
                return RV.NowMap.getData().id;
            } else if (s1 == 1) {
                return RV.GameData.money;
            } else if (s1 == 2) {
                return IInput.x;
            } else if (s1 == 3) {
                return IInput.y;
            }
        }else if(type == 6){
            rect = null;
            et = RV.NowMap.findEnemy(s1);
            if(et != null){
                rect = et.getRect();
            }
            if (s2 == 0) {
                if(rect != null){
                    return parseInt(rect.centerX / RV.NowProject.blockSize);
                }

            } else if (s2 == 1) {
                if(rect != null){
                    return parseInt((rect.bottom - RV.NowProject.blockSize) / RV.NowProject.blockSize);
                }
            } else if (s2 == 2) {
                if(et != null){
                    return et.getDir();
                }
            }
        }
        return val;
    }


    function Calculation(fuc,val1,val2){
        if(fuc == 0) return val2;
        if(fuc == 1) return val1 + val2;
        if(fuc == 2) return val1 - val2;
        if(fuc == 3) return val1 * val2;
        if(fuc == 4) return parseInt(val1 / val2);
        if(fuc == 5) return val1 % val2;
    }

};


IM.IF = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    var id =  main.NowEventId;
    var et = RV.NowMap.findEvent(id);

    this.init = function(){
        var dif = event2DIF();

        if(dif.result()){
            main.insertEvent(event.events[0].events);
        }else if(dif.haveElse){
            main.insertEvent(event.events[1].events);
        }
        return false;
    };

    function event2DIF(){
        var evt = event;
        if (evt.code != 203) return null;
        var dif = new DIf();
        dif.tag = et;
        dif.type = parseInt(evt.args[0]);
        dif.haveElse = evt.args[1] == "1";
        for (var i = 2; i < evt.args.length; i++) {
            var main = evt.args[i].split('Φ');
            var difi = new DIfItem();
            difi.type = parseInt(main[0]);
            difi.num1Index = parseInt(main[1]);
            difi.fuc = parseInt(main[2]);
            difi.type2 = parseInt(main[3]);
            difi.num2 = main[4];
            difi.num2Index =parseInt(main[5]);
            dif.items.push(difi);
        }
        return dif;
    }

};


IM.Loop = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        var newEvents = [];
        for(var i = 0;i<event.events.length;i++){
            newEvents.push(event.events[i]);
        }
        var et = new DEvent();
        et.code = 2041;
        newEvents.push(et);
        main.insertEvent(newEvents);
        return false;
    };

};

IM.LoopUp = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        for(var i = main.pos;i >= 0;i--){
            if(main.event_list[i].code == 204){
                main.pos = i;
                break;
            }else{
                main.event_list.splice(i,1);
            }
        }
        main.pos -= 1;
        return false;
    };

};

IM.LoopBreak = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var index = -1;
        for(var i = main.pos;i < main.event_list.length;i++){
            if(main.event_list[i].code == 2041){
                index = i;
                break;
            }
        }
        for(i = index ;i >= 0;i--){
            if(main.event_list[i].code == 204){
                main.pos = i;
                break;
            }else{
                main.event_list.splice(i,1);
            }
        }
        return false;
    };

};

IM.Event = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var trigger = RV.NowSet.findEventId(parseInt(event.args[0]));
        main.insertEvent(trigger.events);

    }
};

IM.MapMove = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var wait = false;

    this.init = function(){
        var mapId = 0;
        var x = 0;
        var y = 0;
        var dir = -1;

        if(event.args[0] == "0"){
            mapId = parseInt(event.args[1]);
            x = parseInt(event.args[2]);
            y = parseInt(event.args[3]);
        }else if(event.args[0] == "1"){
            mapId =  RV.GameData.getValue(parseInt(event.args[1]),0);
            x = RV.GameData.getValue(parseInt(event.args[2]),0);
            y = RV.GameData.getValue(parseInt(event.args[3]),0);
        }
        dir = parseInt(event.args[4]) - 1;

        RV.NowMap.moveMap(mapId , x , y , dir , function(){
            wait = true;
        });

    };

    this.isFinish = function(){
        return wait;
    };

};


IM.TriggerMove = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var et = null;
        if(event.args[4] == "-20"){
            et = RV.NowMap.findEvent(main.NowEventId);
        }else{
            et = RV.NowMap.findEvent(parseInt(event.args[4]));
        }
        if(et != null){
            if(et instanceof LInteractionBlock){
                if(event.args[0] === "0"){
                    et.x = parseInt(event.args[1]) * RV.NowProject.blockSize;
                    et.y = parseInt(event.args[2]) * RV.NowProject.blockSize;

                }else{
                    et.x = RV.GameData.getValue(parseInt(event.args[1])) * RV.NowProject.blockSize;
                    et.y = RV.GameData.getValue(parseInt(event.args[2])) * RV.NowProject.blockSize;
                }
            }else{
                var actor = et.getCharacter();
                if(actor != null){
                    if(event.args[0] === "0"){
                        et.getCharacter().getCharacter().x = parseInt(event.args[1]) * RV.NowProject.blockSize;
                        et.getCharacter().getCharacter().y = parseInt(event.args[2]) * RV.NowProject.blockSize;

                    }else{
                        et.getCharacter().getCharacter().x = RV.GameData.getValue(parseInt(event.args[1])) * RV.NowProject.blockSize;
                        et.getCharacter().getCharacter().y = RV.GameData.getValue(parseInt(event.args[2])) * RV.NowProject.blockSize;
                    }
                    et.getCharacter().Speed = [0,0];
                    et.getCharacter().getCharacter().setDir( parseInt(event.args[3]) );
                    et.updateIconPoint();
                }else{
                    var rect = et.getUserRect();
                    if(event.args[0] === "0"){
                        rect.x = parseInt(event.args[1]) * RV.NowProject.blockSize;
                        rect.y = parseInt(event.args[2]) * RV.NowProject.blockSize;

                    }else{
                        rect.x = RV.GameData.getValue(parseInt(event.args[1])) * RV.NowProject.blockSize;
                        rect.y = RV.GameData.getValue(parseInt(event.args[2])) * RV.NowProject.blockSize;
                    }
                    et.updateIconPoint();
                }

            }

        }
    }
};

IM.SelfSwitch = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;


    this.init = function(){
        var id =  main.NowEventId;
        var et = RV.NowMap.findEvent(id);
        if(et != null){
            et.setSwitch(parseInt(event.args[0]),event.args[1] == "1");
        }
        return false;
    };
};

IM.GameOver = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.getActor().deathDo();
        return true;
    }
};

IM.GameWin = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RF.GameWin();
        return true;
    }

};/**
 * Created by 七夕小雨 on 2019/3/19.
 */
IM.Flash = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var color = new IColor(parseInt(event.args[2]),parseInt(event.args[3]),parseInt(event.args[4]),parseInt(event.args[1]));
        RV.NowCanvas.flash(color,parseInt(event.args[0]));
        return false;
    };

};


IM.Shack = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.startShack(parseInt(event.args[1]) , parseInt(event.args[2]) , parseInt(event.args[0]));
        return false;
    };

};

IM.MaskIn = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var color = new IColor(parseInt(event.args[2]),parseInt(event.args[3]),parseInt(event.args[4]),parseInt(event.args[1]));
        RV.NowCanvas.maskFadeIn(color,parseInt(event.args[0]));
        return false;
    }

};

IM.MakeOut = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowCanvas.maskFadeOut(parseInt(event.args[0]));
        return false;
    }
};

IM.Weather = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowCanvas.weather.setWeatherType(parseInt(event.args[0]));
        return false;
    }
};

IM.PicShow = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var id = parseInt(event.args[0]) - 1;
        if(RV.NowCanvas.pics[id] != null){
            RV.NowCanvas.pics[id].dispose();
            RV.NowCanvas.pics[id] = null;
        }
        var path = "";
        if(event.args[1] == "0"){
            path = event.args[2];
        }else if(event.args[1] == "1"){
            path = RV.GameData.getValues(parseInt(event.args[2]));
        }
        var point = 0;
        if(event.args[3] == "1"){
            point = 0.5;
        }
        var x = 0;
        var y = 0;
        if(event.args[4] == "0"){
            x = parseInt(event.args[5]);
            y = parseInt(event.args[6]);
        }else{
            x = RV.GameData.getValueNum(parseInt(event.args[5]),0);
            y = RV.GameData.getValueNum(parseInt(event.args[6]),0);
        }
        var sp = new ISprite(RF.LoadBitmap("Picture/" + path));
        sp.yx = point;
        sp.yy = point;
        sp.x = x;
        sp.y = y;
        sp.zoomX = parseInt(event.args[7]) / 100;
        sp.zoomY = parseInt(event.args[8]) / 100;
        sp.opacity = parseInt(event.args[9]) / 255;
        sp.angle = parseInt(event.args[10]);

        sp.mirror = event.args[11] == "1";

        sp.z = 6000 + id;
        RV.NowCanvas.pics[id] = sp;
        return false;
    };
};

IM.PicMove = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var wait = 0;

    this.init = function(){
        var id = parseInt(event.args[0]) - 1;
        if(RV.NowCanvas.pics[id] != null){
            var w = parseInt(event.args[1]);
            if(event.args[2] == "1"){
                wait = w;
            }
        }
        var point = 0;
        if(event.args[3] == "1"){
            point = 0.5;
        }
        var x = 0;
        var y = 0;
        if(event.args[4] == "0"){
            x = parseInt(event.args[5]);
            y = parseInt(event.args[6]);
        }else{
            x = RV.GameData.getValueNum(parseInt(event.args[5]),0);
            y = RV.GameData.getValueNum(parseInt(event.args[6]),0);
        }
        var sp = RV.NowCanvas.pics[id];
        if(sp == null) return false;
        sp.yx = point;
        sp.yy = point;
        sp.slideTo(x,y,w);
        sp.scaleTo(parseInt(event.args[7]) / 100 , parseInt(event.args[8]) / 100,w);
        sp.fadeTo(parseInt(event.args[9]) / 255,w);
        sp.rotateTo(parseInt(event.args[10]),w);
        sp.mirror = event.args[11] == "1";

        return false;
    };

    this.update = function(){
        wait -= 1
    };

    this.isFinish = function(){
        return wait <= 0
    };
};

IM.PicDel = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var id = parseInt(event.args[0]) - 1;
        if(RV.NowCanvas.pics[id] != null){
            RV.NowCanvas.pics[id].dispose();
            delete RV.NowCanvas.pics[id];
        }
        return false;
    };
};

IM.ShowAnim = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        //触发器的情况
        var rect = null;
        var et = null ;
        if(event.args[1] == "0"){
            if(event.args[2] == "-10"){
                et = RV.NowMap.getActor();
            }else if(event.args[2] == "-20"){
                et = RV.NowMap.findEvent(main.NowEventId);
                if(et.getCharacter() == null){
                    rect = et.getRect();
                    et = null;
                }

            }else{
                et = RV.NowMap.findEvent(parseInt(event.args[2]));
                if(et.getCharacter() == null){
                    rect = et.getRect();
                    et = null;
                }
            }
        }else {
            et = RV.NowMap.findEnemy(parseInt(event.args[2]));
        }

        if(et != null || rect != null){
            RV.NowCanvas.playAnim(parseInt(event.args[3]),null,et,event.args[4] == "0",rect,event.args[0]);
        }


        return false;
    };
};

IM.StopAnim = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var am = RV.NowCanvas.findAnim(event.args[0]);
        if(am != null){
            am.dispose();
            RV.NowCanvas.anim.remove(am);
        }
    }

};



IM.ViewMove = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.viewMove = false;
        RV.NowMap.getActor().isLook = false;
        var view = RV.NowMap.getView();
        var x = parseInt(event.args[0]) * -1;
        var y = parseInt(event.args[1]) * -1;
        view.shifting(view.ox,view.oy,view.ox + x , view.oy + y,parseInt(event.args[2]));
        return false;
    };
};

IM.ViewReset = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.getActor().isLook = !RV.NowMap.getData().autoMove;
        RV.NowMap.viewMove = RV.NowMap.getData().autoMove;
        return false;
    };


};
/**
 * Created by 七夕小雨 on 2019/3/19.
 */
IM.EventAction = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var wait = 0;
    var actor = null;

    this.init = function(){
        var index = parseInt(event.args[0]);

        if(index == -10){//角色本身
            actor = RV.NowMap.getActor();
        }else if(index == -20){//本触发器
            var temp = RV.NowMap.findEvent(main.NowEventId);
            if(temp instanceof LTrigger){
                actor = temp.getCharacter();
            }else if(temp instanceof LInteractionBlock){
                actor = temp;
            }
        }else{
            temp = RV.NowMap.findEvent(index);
            if(temp instanceof LTrigger){
                actor = temp.getCharacter();
            }else if(temp instanceof LInteractionBlock){
                actor = temp;
            }
        }
        if(actor != null){
            actor.setAction(event.events,event.args[1] == "1",event.args[2] == "1");
        }
        return false;
    };


    this.isFinish = function(){
        if(event.args[3] == "1"){
            if(actor == null){
                return true;
            }else{
                return !actor.actionStart;
            }
        }else{
            return true;
        }

    };

};


IM.BlockAction = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    var wait = 0;
    var block = null;

    this.init = function(){
        var tags = event.args[0].split(",");
        var mark = tags[1] + "," + tags[2];
        block = RV.NowMap.findBlock(mark);
        if(block != null){
            block.setAction(event.events,event.args[1] == "1",event.args[2] == "1");
        }
        return false;
    };


    this.isFinish = function(){
        if(event.args[3] == "1"){
            if(block == null){
                return true;
            }else{
                return !block.actionStart;
            }
        }else{
            return true;
        }

    };
};

IM.AddActorValue = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var value = parseInt(event.args[1]);
        if(event.args[0] == "0"){//等级
            RV.GameData.actor.levelUp(value);
        }else if(event.args[0] == "1"){//经验
            RV.GameData.actor.exp += value;
        }else if(event.args[0] == "2"){//MAXHP
            RV.GameData.actor.addPow.maxHp += value;
        }else if(event.args[0] == "3"){//MAXMP
            RV.GameData.actor.addPow.maxMp += value;
        }else if(event.args[0] == "4"){//物理攻击
            RV.GameData.actor.addPow.watk += value;
        }else if(event.args[0] == "5"){//物理防御
            RV.GameData.actor.addPow.wdef += value;
        }else if(event.args[0] == "6"){//魔法攻击
            RV.GameData.actor.addPow.matk += value;
        }else if(event.args[0] == "7"){//魔法防御
            RV.GameData.actor.addPow.mdef += value;
        }else if(event.args[0] == "8"){//速度
            RV.GameData.actor.addPow.speed += value;
        }else if(event.args[0] == "9"){//幸运
            RV.GameData.actor.addPow.luck += value;
        }
        return false;
    };
};

IM.ChangeHPMP = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var value = parseInt(event.args[3]);
        if(event.args[0] == "0"){//敌人
            var enemy = RV.NowMap.findEnemy(parseInt(event.args[1]));
            if(enemy != null){
                if(event.args[2] == "0"){
                    enemy.getActor().injure(0,-value);
                }else if(event.args[2] == "1"){
                    enemy.mp += value;
                }
            }
        }else{
            if(event.args[2] == "0"){
                RV.GameData.actor.hp += value;
            }else if(event.args[2] == "1"){
                RV.GameData.actor.mp += value;
            }
        }
        return false;
    };
};

IM.ChangeSkill = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        if(event.args[0] == "0"){//学习
            RV.GameData.actor.studySkill(parseInt(event.args[1]));
        }else {//遗忘
            RV.GameData.actor.forgetSkill(parseInt(event.args[1]));
            for(var i = 0; i< RV.GameData.userSkill.length; i++){
                if(RV.GameData.actor.skill.indexOf(RV.GameData.userSkill[i]) == -1){
                    RV.GameData.userSkill[i] = 0;
                }
            }

        }
        return false;
    };
};

IM.ChangeBuff = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var value = parseInt(event.args[3]);
        if(RV.NowSet.findStateId(value) != null){
            var obj = null;
            if(event.args[0] == "0"){//敌人
                obj = RV.NowMap.findEnemy(parseInt(event.args[1]));
            }else{
                obj = RV.GameData.actor;
            }
            if(obj != null){
                if(event.args[2] == "0"){
                    obj.addBuff(value);
                }else{
                    obj.subBuff(value);
                }
            }
        }

        return false;
    };
};

IM.ChangeActor = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var newActorData = RV.NowSet.findActorId( parseInt(event.args[0]));
        if(newActorData != null){

            RV.GameData.actor.changeData(newActorData,event.args[1] == "1");
            var res = RV.NowRes.findResActor(parseInt(newActorData.actorId));
            if(res != null){
                RV.NowMap.getActor().getCharacter().changeImage(res);
            }
        }
        return false;
    };
};

IM.ChangeJumpNum = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.getActor().JumpTimes = parseInt(event.args[0]);
        RV.GameData.jumpTimes = parseInt(event.args[0]);
        return false;
    };
};

IM.ChangeEquip = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var item = new DBagItem();
        if(event.args[0] == "0"){
            item.type = 1;
        }else{
            item.type= 2;
        }
        item.id = parseInt(event.args[1]);
        item.num = 1;
        if(item.findData() != null){
            RV.GameData.actor.equipLoad(item);
            RV.GameData.actor.updateEquip();
        }
        return false;
    };
};

IM.ChangeJumpSpeed = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.getActor().JumpNum = parseInt(event.args[0]);
        RV.GameData.jumpNum = parseInt(event.args[0]);
        return false;
    };
};

IM.ChangeGravity = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.NowMap.changeGravityNum(parseInt(event.args[0]));
        return false;
    };
};

IM.SetEnemy = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var enemy = RV.NowMap.findEnemy( parseInt(event.args[0]) );
        if(enemy != null){
            enemy.activity = event.args[1] === "1";
            enemy.visible = event.args[2] === "1";
        }
        return false;
    };
};

IM.BossBar = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var enemy = RV.NowMap.findEnemy( parseInt(event.args[0]) );
        if(enemy != null){
            if(IVal.scene instanceof SMain){
                IVal.scene.getMainUI().callBossBar(enemy);
            }
        }
        return false;
    };
};

IM.addEnemy = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var enemy = new DMapEnemy();
        enemy.index = RV.GameData.enemyIndex;
        enemy.eid = parseInt(event.args[3]);
        //兼容旧版设置
        if(event.args[4] != null){
            enemy.dir = parseInt(event.args[4]);
        }
        if(event.args[0] == "0"){//指定坐标
            enemy.x = parseInt(event.args[1]);
            enemy.y = parseInt(event.args[2]);
        }else{//自定义坐标
            enemy.x = RV.GameData.getValue(parseInt(event.args[1]),0);
            enemy.y = RV.GameData.getValue(parseInt(event.args[2]),0);
        }
        RV.NowMap.drawEnemys(enemy);
        RV.GameData.enemyIndex += 1;
        return false;
    };
};

IM.SetActorLevel = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var index = parseInt(event.args[0]);
        var actor = null;
        if(index == -10){//角色本身
            actor = RV.NowMap.getActor();
        }else if(index == -20){//本触发器
            var temp = RV.NowMap.findEvent(main.NowEventId);
            if(temp instanceof LTrigger){
                actor = temp.getCharacter();
            }
        }else{
            temp = RV.NowMap.findEvent(index);
            if(temp instanceof LTrigger){
                actor = temp.getCharacter();
            }
        }
        if(actor != null){
            var char = actor.getCharacter();
            if(event.args[1] == "0"){
                char.autoZ = false;
                char.topZ = false;
            }else if(event.args[1] == "1"){
                char.autoZ = true;
                char.topZ = false;
            }else if(event.args[1] == "2"){
                char.autoZ = false;
                char.topZ = true;
            }
        }
        return false;
    };

};/**
 * Created by 七夕小雨 on 2019/3/19.
 */
IM.BGMPlay = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameSet.playBGM("Audio/" + event.args[0],parseInt(event.args[1]));
        return false;
    };
};


IM.BGSPlay = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameSet.playBGS("Audio/" + event.args[0],parseInt(event.args[1]));
        return false;
    };
};

IM.SEPlay = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameSet.playSE("Audio/" + event.args[0],parseInt(event.args[1]));
        return false;
    };
};

IM.BGMFade = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameSet.nowBGMFile = "";
        IAudio.BGMFade(parseInt(event.args[0]));
        return false;
    };
};

IM.BGSFade = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameSet.nowBGSFile = "";
        IAudio.BGSFade(parseInt(event.args[0]));
        return false;
    };
};

IM.SEStop = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        IAudio.stopSE();
        return false;
    };
};/**
 * Created by 七夕小雨 on 2019/3/19.
 */

IM.Money = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameData.money += parseInt(event.args[0]);
        if(RV.GameData.money < 0){
            RV.GameData.money = 0;
        }
        return false;
    };
};


IM.AddItems = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.GameData.addItem(parseInt(event.args[0]) , parseInt(event.args[1]) , parseInt(event.args[2]));
        return false;
    };
};


IM.Shop = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var items = "";
        for(var i = 0;i<event.args.length;i++){
            var temp = event.args[i].split("|");
            var item = temp[0] + "," + temp[1];
            if(i != event.args.length - 1) item += "|";
            items += item;
        }
        if(IVal.scene instanceof SMain){
            var ui =  RV.NowUI.uis[11];
            var sui = IVal.scene.initSelfUI(ui,"\"" + items + "\"");
        }
        return false;
    };
};

IM.ShowMenu = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var index = parseInt(event.args[0]);
        var id = -1;
        if(index === 0){//装备
            id = 5;
        }else if(index === 1){//技能
            id = 6;
        }else if(index === 2){//物品
            id = 7
        }else if(index === 3){//设置
            id = 8;
        }
        if(main.ui == null){
            var ui =  RV.NowUI.uis[id];
            if(ui != null && IVal.scene instanceof  SMain){
                IVal.scene.initSelfUI(ui,"");
            }
        }else{
            ui =  RV.NowUI.uis[id];
            main.ui.showChildfUI(ui,"");
        }
        return false;
    };
};

IM.SaveGame = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RF.SaveGame();
        return false;
    };
};

IM.LoadGame = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        RV.isLoad = true;

        return false;
    };
};


IM.Script = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        var _sf = null;
        var obj = null;
        if(main.ctrl != null){
            _sf = main.ctrl;
            obj = main.ctrl.obj;
        }
        if(main.ctrl == null && main.ui != null){
            _sf = main.ui;
        }
        eval(event.args[0]);
        return false;
    };
};

IM.mainUI = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){
        //hp条
        RV.GameData.uiHp = event.args[0] == "1";
        //命数
        RV.GameData.uiLife = event.args[1] == "1";
        //mp条
        RV.GameData.uiMp = event.args[2] == "1";
        //经验条、等级
        RV.GameData.uiExp = event.args[3] == "1";
        //金币
        RV.GameData.uiMoney = event.args[4] == "1";
        //菜单按钮
        RV.GameData.uiMenu = event.args[5] == "1";
        //物品快捷栏
        RV.GameData.uiItems = event.args[6] == "1";
        //技能栏
        RV.GameData.uiSkill = event.args[7] == "1";
        //手机控制器
        RV.GameData.uiPhone = event.args[8] == "1";
        return false;
    };
};

IM.callSelfUI = function(event,main){
    this.base = IEventBase;
    this.base();
    delete this.base;

    this.init = function(){

        if(main.ui == null){
            var ui =  RV.NowUI.uis[event.args[0]];
            if(ui != null && IVal.scene instanceof  SMain){
                IVal.scene.initSelfUI(ui,event.args[1]);
            }
        }else{
            ui =  RV.NowUI.uis[event.args[0]];
            main.ui.showChildfUI(ui,event.args[1]);
        }
        return false;
    };

};

/**
 * Created by 七夕小雨 on 2018/6/25.
 * 事件解释器
 */
function IMain(){
    //当前解释的事件
    var event_now = null;
    //事件队列（数据）
    this.event_list = [];
    //事件位置指针
    this.pos = -1;
    //事件队列是否处理完毕
    this.isEnd = false;
    //堆栈
    this.indentStack = [];
    //子事件处理
    this.subStory = null;

    var _sf = this;
    //执行触发器的场景
    this.scene = null;
    //触发器的tag
    this.tag = null;
    //执行触发器的当前ID
    this.NowEventId = -1;

    /**
     * 向当前解释位置插入事件
     * @param events 事件集合
     */
    this.insertEvent = function(events){
        for(var i = events.length - 1;i>=0;i--){
            this.event_list.splice(this.pos + 1,0,events[i]);
        }
        this.isEnd = false;
    };

    /**
     * 向事件解释器末尾增加事件
     * @param events 事件集合
     */
    this.addEvents = function(events){
        if(events.length <= 0) return;
        if(this.event_list.length == 0){
            this.pos = -1;
        }
        this.event_list = this.event_list.concat(events);
        this.isEnd = false;
    };

    /**
     * 事件解释器强制结束
     */
    this.endInterpreter = function(){
        this.subStory = null;
        event_now = null;
        this.pos = -1;
        this.isEnd = true;
    };
    /**
     * 事件解释器主循环
     * @returns {boolean}
     */
    this.update = function(){
        if(_sf.isEnd){
            return false;
        }
        if(_sf.subStory != null && _sf.subStory.isEnd){
            _sf.subStory = null;
        }
        if(_sf.subStory != null && !_sf.subStory.isEnd){
            _sf.subStory.update();
            return true;
        }
        while(true){
            if(event_now == null && _sf.isEnd){
                break;
            }
            if(event_now == null || event_now.isFinish()){
                if(event_now != null){
                    event_now.finish();
                }
                if(poaAdd()){
                    break;
                }
            }
            if(event_now != null && ! event_now.isFinish()){
                event_now.update();
                break;
            }
        }
        return true;
    };

    /**
     * 事件索引指针推进
     * @returns {boolean}
     */
    function poaAdd(){
        _sf.pos += 1;
        if(_sf.pos >= _sf.event_list.length){
            _sf.isEnd = true;
            _sf.event_list = [];
            event_now = null;
            return false;
        }
        if(makerEvent(_sf.event_list[_sf.pos])){
            return true;
        }
    }

    /**
     * 数据转译
     * @param e 事件数据
     * @returns {boolean}
     */
    function makerEvent(e){
        var ee = new IList();
        event_now = ee.MakeEvent(e,_sf);
        return event_now == null ? false : event_now.init();
    }

    /**
     * 跳转至指定事件位置
     * @param index
     */
    this.jumpToIndex = function(index){
        _sf.pos = index - 1;
        if(_sf.pos >= _sf.event_list.length){
            _sf.isEnd = true;
            event_now = null;
        }
    };
    /**
     * 条件分歧
     * @param FIndex 条件结束的事件位置
     * @constructor
     */
    this.IFInfo = function(FIndex){
        this.FinishJumpIndex = FIndex;
    };
    /**
     * 循环
     * @param l 循环起点位置
     * @param b 循环终点位置
     * @constructor
     */
    this.LoopInfo = function(l,b){
        this.LoopIndex = l;
        this.BreakIndex = b;
    };

    /**
     * 选项
     * @param Cindex 选项位置
     * @param FIndex 终点位置
     * @constructor
     */
    this.BranchInfo = function(Cindex,FIndex){
        this.ChoiceJumpIndex = Cindex;
        this.FinishJumpIndex = FIndex;

        this.GetJumpIndex = function(selectIndex){
            return this.ChoiceJumpIndex[selectIndex];
        }
    };
    /**
     * 选项出栈
     * @returns {*}
     */
    this.AuxFetchBranchinfo = function(){
        var s = null;
        while (true) {
            if(_sf.indentStack.length <= 0) {s = null ;break;}
            s = _sf.indentStack[_sf.indentStack.length -1];
            _sf.indentStack.remove(_sf.indentStack.length - 1);
            if(s == null || s instanceof _sf.BranchInfo) break;
        }
        _sf.endLogic = s;
        return s;
    };
    /**
     * 循环出栈
     * @returns {*}
     */
    this.AuxFetchLoopinfo = function(){
        var s = null;
        while (true) {
            if(_sf.indentStack.length <= 0) {s = null ;break;}
            s = _sf.indentStack[_sf.indentStack.length -1];
            _sf.indentStack.remove(_sf.indentStack.length - 1);
            if(s == null || s instanceof _sf.LoopInfo) break;
        }
        _sf.endLogic = s;
        return s;
    };
    /**
     * 条件分歧出栈
     * @returns {*}
     */
    this.AuxFetchIfinfo = function(){
        var s = null;
        while (true) {
            if(_sf.indentStack.length <= 0) {s = null ;break;}
            s = _sf.indentStack[_sf.indentStack.length -1];
            _sf.indentStack.remove(_sf.indentStack.length - 1);
            if(s == null || s instanceof _sf.IFInfo) break;
        }
        _sf.endLogic = s;
        return s;
    }


}/**
 * Created by 七夕小雨 on 2019/1/10.
 * 角色逻辑类，派生出 LTrigger、LEnemy
 * @param view 要放入角色的视窗
 * @param maxX 所承载地图最大宽度
 * @param maxY 所承载地图最大高度
 * @param data 地图中所有基础图块
 * @param block 地图中所有交互图块
 * @param x 生成X坐标
 * @param y 生成Y坐标
 * @param resId 行走图资源ID
 * @param z  Z坐标
 */
function LActor(view , maxX , maxY , data , block , x , y , resId,z){
    var _sf = this;
    //==================================== 公有属性 ===================================
    //相对于四个方向的速度 0-上 1-左
    this.Speed = [0,0];
    //死亡回调
    this.DieDo = null;
    //受伤回调
    this.InjuredDo = null;
    //是否拥有重力
    this.IsGravity = false;
    //重力系数
    this.GravityNum = 0;
    //跳跃系数
    this.JumpNum = 0;
    //跳跃次数
    this.JumpTimes = 0;
    //是否穿透
    this.IsCanPenetrate = false;
    //被摄像机聚焦
    this.isLook = false;
    //阵营
    this.camp = 0;
    //攻击方式
    this.atkType = 0;
    //攻击距离
    this.atkDis = 1;
    this.bulletId = 1;
    //无敌
    this.invincibleTime = 0;
    //霸体
    this.superArmor = false;
    //硬直时间
    this.stiffTime = 0;
    //战斗中
    this.combatTime = 0;
    //移动步数
    this.moveNum = 0;
    //是否在技能吟唱
    this.skillChant = false;
    //外部控制相关变量移动
    this.actionStart = false;
    this.actionLock = false;
    this.reAction = false;
    //普通攻击间隔,若未装备武器 则默认35
    this.atkWait = 35;
    //当前正在释放的技能
    this.nowSkill = null;
    //==================================== 私有属性 ===================================
    var atkWaitNow = 0;
    //资源中的角色数据
    var resData = RV.NowRes.findResActor(resId);
    //实例化LCharacters，用于画面表现

    if(resData == null) throw new Error('错误的角色编号：' + resId);
    var character = new LCharacters(resData,view,z,data,block);
    character.actor = this;
    character.CanPenetrate = this.IsCanPenetrate;
    //将人物强制设置到 参数X Y位置
    character.mustXY(x,y);

    //是否跳跃中
    var isJump = false;
    //跳跃冷却计数
    var jumpWait = 0;
    var jumpTimes = 0;
    //是否下蹲
    var isSquat = false,isRSquat = false;
    //是否正在移动、跑动
    var isMove = false,  isRun = false;
    var isAtk = false;
    //基础移动速度
    this.baseSpeed = 2;
    this.speedEfficiency = 1;
    //基础速率
    this.actionRate = 5;

    var nowRate = this.actionRate;
    var actionSpeed = this.baseSpeed;
    var moveWait = 0;
    var moveWaitUD = 0;
    var actionIgnore = false;
    var actionLoop = false;
    var actionMove = false;
    var actionJump = false;
    var actionJumpHeight = 0;
    var actionJumpHeightA = 0;
    var actionJumpHeightY = 0;
    var actionJumpHeightX = 0;
    var tempJumpX = 0;
    var actionList = [];
    var actionPos = -1;
    var nowAction = null;
    var actionWait = 0;
    var moveDir = -1;
    var moveDis = 0;

    var oldGravity = false;
    var oldLock = false;
    var oldSpeed = false;
    var oldRate = false;

    var validRect = new IRect(1,1,1,1);


    this.isDie = false;

    //==================================== 公有函数 ===================================

    /**
     * 主刷新
     */
    this.update = function(){
        character.actionRate = _sf.actionRate * _sf.speedEfficiency;
        character.updateBase();
        if(_sf.isDie) return;
        updateEnemyCollision();
        updateAction();
        actorMove();
        if(_sf.isLook) _sf.correctedViewport();
        death();
        updateBlock();
        if(isRun){
            actionSpeed = (_sf.baseSpeed  + 2) * _sf.speedEfficiency;
        }else{
            actionSpeed = (_sf.baseSpeed * _sf.speedEfficiency);
        }
        if(!_sf.actionStart && !_sf.reAction){
            isMove = false;
            isRun = false;
        }
        isRSquat = false;

        //character.resetPublicBlock();
        if(_sf.invincibleTime > 0){
            _sf.invincibleTime -= 1;
        }
        if(_sf.stiffTime > 0){
            _sf.stiffTime -= 1;
        }
        if(_sf.combatTime > 0){
            _sf.combatTime -= 1;
        }
        if(atkWaitNow > 0){
            atkWaitNow -= 1;
        }
    };

    /**
     * 释放
     */
    this.dispose = function(){
        character.disposeBase();
    };

    this.setInitData = function(mx,my,m,b){
        maxX = mx;
        maxY = my;
        data = m;
        block = b;
        character.setInitData(m,b);
    };

    /**
     * 镜头注视此Actor
     */
    this.lookActor = function(){
        var rect = character.getCharactersRect();
        var point = [rect.centerX, rect.bottom - RV.NowProject.blockSize];
        var ox = -1 * (point[0] - (view.width / 2));
        var oy = -1 * (point[1] - (view.height / 2));
        var leftMax = 0;
        var rightMax = maxX;
        var topMax = 0;
        var bottomMax = maxY;
        if(ox > leftMax) ox = leftMax;
        if(ox < -(rightMax - view.width)) ox = -(rightMax - view.width);
        if(oy > topMax) oy = topMax;
        if(oy < -(bottomMax - view.height)) oy = -(bottomMax - view.height);
        view.ox = ox;
        view.oy = oy;
    };

    /**
     * 镜头修正
     */
    this.correctedViewport = function(){
        //人物在中央原则
        var point = [character.x,character.y];

        var ox = view.ox;
        var oy = view.oy;


        var leftMax = 0;
        var rightMax = maxX * view.zoomX;
        var topMax = 0;
        var bottomMax = maxY * view.zoomY;
        if(RV.NowMap.viewMove){
            var speed = (RV.NowMap.viewSpeed + 1) / 10;
            var tempX = -1 * (point[0] - (view.width / 2));
            var tempY = -1 * (point[1] - (view.height / 2));
            if(RV.NowMap.viewDir == 0){//上
                oy += speed;
                oy = Math.max(oy,tempY);
                ox = tempX;
            }else if(RV.NowMap.viewDir == 1){//下
                oy -= speed;
                oy = Math.min(oy,tempY);
                ox = tempX;
            }else if(RV.NowMap.viewDir == 2){//左
                ox += speed;
                ox = Math.max(ox,tempX);
                oy = tempY;
            }else if(RV.NowMap.viewDir == 3){//右
                ox -= speed;
                ox = Math.min(ox,tempX);
                oy = tempY;
                //leftMax = ox;
            }
        }else{
            ox = -1 * (point[0] - ((view.width / view.zoomX) / 2));
            oy = -1 * (point[1] - ((view.height / view.zoomY) / 2));
        }

        if(ox > leftMax) ox = leftMax;
        if(ox < -(rightMax - view.width)) ox = -(rightMax - view.width);

        if(oy > topMax) oy = topMax;
        if(oy < -(bottomMax - view.height)) oy = -(bottomMax - view.height);

        view.ox = ox;
        view.oy = oy;
    };

    /**
     * 跳跃
     * @returns {boolean} 是否跳跃成功
     */
    this.jump = function(){
        if(actionJump || _sf.stiffTime > 0) return;
        if(isCanJump()){
            if(isSquat && character.BlockBelow == 4){
                character.y += RV.NowProject.blockSize;
                return true;
            }else if(!isSquat){
                if(character.IsInSand){
                    _sf.Speed[0] = -_sf.JumpNum / 2;
                }else{
                    _sf.Speed[0] = -_sf.JumpNum;
                }
                isJump = true;
                jumpTimes += 1;
                jumpWait = 5;
                var sound = RV.NowSet.setAll.jumpSound;
                RV.GameSet.playSE("Audio/" + sound.file,sound.volume);
                return true;
            }

        }
        return false;
    };

    /**
     * 下蹲
     * @returns {boolean} 是否下蹲成功
     */
    this.squat = function(){
        if(actionJump || _sf.stiffTime > 0) return false;
        if(!isJump && _sf.Speed[0] == 0){
            isSquat = true;
            isRSquat = true;
            return true;
        }
        return false;
    };

    /**
     * 上移动
     */
    this.moveUp = function(){
        if( _sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed;
        _sf.Speed[0] -= max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[0] <= -max * 1.5){
                _sf.Speed[0] = -max * 1.5;
            }
        }else{
            if(_sf.Speed[0] <= -max){
                _sf.Speed[0] = -max;
            }
        }
        if(!_sf.atking()) character.setDir(3,true);
        isMove = true;
    };

    this.moveDown = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed;
        _sf.Speed[0] += max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[0] >= max * 1.5){
                _sf.Speed[0] = max * 1.5;
            }
        }else{
            if(_sf.Speed[0] >= max){
                _sf.Speed[0] = max;
            }
        }
        if(!_sf.atking()) character.setDir(0,true);
        isMove = true;
    };

    /**
     * 左移动
     */
    this.moveLeft = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed;
        _sf.Speed[1] -= max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] <= -max * 1.5){
                _sf.Speed[1] = -max * 1.5;
            }
        }else{
            if(_sf.Speed[1] <= -max){
                _sf.Speed[1] = -max;
            }
        }
        if(!_sf.atking()) character.setDir(1,true);
        isMove = true;
    };



    /**
     * 右移动
     */
    this.moveRight = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed;
        _sf.Speed[1] += max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] >= max * 1.5){
                _sf.Speed[1] = max * 1.5;
            }
        }else{
            if(_sf.Speed[1] >= max){
                _sf.Speed[1] = max;
            }

        }
        if(!_sf.atking()) character.setDir(2,true);
        isMove = true;
    };


    /**
     * 左下移动
     */
    this.moveLeftDown = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed / 1.4;
        _sf.Speed[0] += max / 4;
        _sf.Speed[1] -= max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] <= -max * 1.5){
                _sf.Speed[1] = -max * 1.5;
            }
            if(_sf.Speed[0] >= max * 1.5){
                _sf.Speed[0] = max * 1.5;
            }
        }else{
            if(_sf.Speed[1] <= -max){
                _sf.Speed[1] = -max;
            }
            if(_sf.Speed[0] >= max){
                _sf.Speed[0] = max;
            }
        }
        if(!_sf.atking()) character.setDir(4,true);
        isMove = true;
    };

    /**
     * 右下移动
     */
    this.moveRightDown = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed / 1.4;
        _sf.Speed[0] += max / 4;
        _sf.Speed[1] += max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] >= max * 1.5){
                _sf.Speed[1] = max * 1.5;
            }
            if(_sf.Speed[0] >= max * 1.5){
                _sf.Speed[0] = max * 1.5;
            }
        }else{
            if(_sf.Speed[1] >= max){
                _sf.Speed[1] = max;
            }
            if(_sf.Speed[0] >= max){
                _sf.Speed[0] = max;
            }
        }
        if(!_sf.atking()) character.setDir(5,true);
        isMove = true;
    };

    /**
     * 左上移动
     */
    this.moveLeftUp = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed / 1.4;
        _sf.Speed[0] -= max / 4;
        _sf.Speed[1] -= max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] <= -max * 1.5){
                _sf.Speed[1] = -max * 1.5;
            }
            if(_sf.Speed[0] <= -max * 1.5){
                _sf.Speed[0] = -max * 1.5;
            }
        }else{
            if(_sf.Speed[1] <= -max){
                _sf.Speed[1] = -max;
            }
            if(_sf.Speed[0] <= -max){
                _sf.Speed[0] = -max;
            }
        }
        if(!_sf.atking()) character.setDir(6,true);
        isMove = true;
    };

    /**
     * 右上移动
     */
    this.moveRightUp = function(){
        if(_sf.stiffTime > 0 || (_sf.atking() && _sf.atkType == 0) || _sf.skillChant) return;
        var max = actionSpeed / 1.4;
        _sf.Speed[0] -= max / 4;
        _sf.Speed[1] += max / 4;
        if(character.BlockBelow == 1){
            if(_sf.Speed[1] >= max * 1.5){
                _sf.Speed[1] = max * 1.5;
            }
            if(_sf.Speed[0] <= -max * 1.5){
                _sf.Speed[0] = -max * 1.5;
            }
        }else{
            if(_sf.Speed[1] >= max){
                _sf.Speed[1] = max;
            }
            if(_sf.Speed[0] <= -max){
                _sf.Speed[0] = -max;
            }
        }
        if(!_sf.atking())character.setDir(7,true);
        isMove = true;
    };

    /**
     * 攻击
     * @param obj
     */
    this.atk = function(obj){
        if(actionJump || _sf.stiffTime > 0 || atkWaitNow > 0 || _sf.nowSkill != null) return;
        atkWaitNow = _sf.atkWait / _sf.speedEfficiency;
        isAtk = true;
        if(_sf.atkType == 1 && character.shootCall == null){
            character.shootCall = function(points){
                for(var i = 0;i<points.length;i++){
                    var p = character.getCenterPoint();
                    var x = p[0] + points[i].x;
                    var y = p[1] + points[i].y;
                    RV.NowCanvas.playBullet(_sf.bulletId , _sf , x , y,obj);
                }
                character.shootCall = null;
            };
        }
        if(_sf.atkType == 0){
            character.atkCall = function(){
                var atkRect = _sf.getAtkRect();
                if(_sf.camp == 0){//主角攻击
                    //交互块判定
                    var blocks = character.getInteractionBlocks();
                    if(blocks != null){
                        for(var i = 0;i<blocks.length;i++){
                            if(blocks[i].isDestroy == false && blocks[i].getData().isDestroy == true && blocks[i].isCollision(atkRect)){
                                blocks[i].destroy();
                            }
                        }
                    }
                    //敌人判定
                    var arms = RV.GameData.actor.equips[-1];
                    var armsData = RV.NowSet.findArmsId(arms);
                    var armsAnimId = 0;
                    if(armsData != null){
                        armsAnimId = armsData.atkAnimId;
                    }

                    var enemy = RV.NowMap.getEnemys();
                    for(i = 0;i<enemy.length;i++){
                        if(enemy[i].getActor().camp == 1 && enemy[i].visible && enemy[i].getActor().getValidRect().intersects(atkRect) && !enemy[i].isDie){
                            _sf.combatTime = 120;
                            enemy[i].getActor().combatTime = 300;
                            enemy[i].getActor().injure(2, RF.ActorAtkEnemy(enemy[i],_sf.getDir() ) );
                            RV.NowCanvas.playAnim(armsAnimId,null,enemy[i].getActor(),true);
                        }
                    }
                }else if(_sf.camp == 1){//敌人
                    //判定主角
                    if(RV.NowMap.getActor().getValidRect().intersects(atkRect)){
                        _sf.combatTime = 300;
                        RV.NowMap.getActor().combatTime = 300;
                        RV.NowMap.getActor().injure(3,obj)
                    }
                    //判定友军
                    enemy = RV.NowMap.getEnemys();
                    for(i = 0;i<enemy.length;i++){
                        if(enemy[i].getActor().camp == 2 && enemy[i].visible && enemy[i].getActor().getValidRect().intersects(atkRect) && !enemy[i].isDie){
                            enemy[i].getActor().combatTime = 300;
                            enemy[i].getActor().injure(2, RF.EnemyAtkEnemy(obj,enemy[i] ) );
                        }
                    }

                }else if(_sf.camp == 2){//友军
                    enemy = RV.NowMap.getEnemys();
                    for(i = 0;i<enemy.length;i++){
                        if(enemy[i].getActor().camp == 1 && enemy[i].visible && enemy[i].getActor().getValidRect().intersects(atkRect) && !enemy[i].isDie){
                            enemy[i].getActor().combatTime = 300;
                            enemy[i].getActor().injure(2, RF.EnemyAtkEnemy(obj,enemy[i] ) );
                        }
                    }
                }
                character.atkCall = null;
            }
        }


    };

    /**
     * 获得攻击判定区域
     * @returns {IRect}
     */
    this.getAtkRect = function(){
        var temp = character.getCharactersRect();
        var temp2 = character.getDefRect();
        var rect = new IRect(temp.left,temp.top,temp.right,temp.bottom);
        rect.top = temp.bottom - (temp2.height - (temp2.dy * 2));
        var atkRect = null;
        var dir = _sf.getDir();
        if(dir == 0){//下
            atkRect = new IRect(rect.left,rect.top,rect.right,rect.bottom + _sf.atkDis * RV.NowProject.blockSize);
        }else if(dir == 1){//左
            atkRect = new IRect(rect.left - _sf.atkDis * RV.NowProject.blockSize,rect.top,rect.right,rect.bottom);
        }else if(dir == 2){//右
            atkRect = new IRect(rect.left,rect.top,rect.right + _sf.atkDis * RV.NowProject.blockSize,rect.bottom);
        }else if(dir == 3){//上
            atkRect = new IRect(rect.left,rect.top - _sf.atkDis * RV.NowProject.blockSize , rect.right , rect.bottom);
        }else if(dir == 4){//左下
            atkRect = new IRect(rect.left - _sf.atkDis * RV.NowProject.blockSize ,rect.top,rect.right ,rect.bottom + _sf.atkDis * RV.NowProject.blockSize);
        }else if(dir == 5){//右下
            atkRect = new IRect(rect.left,rect.top,rect.right  + _sf.atkDis * RV.NowProject.blockSize ,rect.bottom + _sf.atkDis * RV.NowProject.blockSize);
        }else if(dir == 6){//左上
            atkRect = new IRect(rect.left  - _sf.atkDis * RV.NowProject.blockSize ,rect.top - _sf.atkDis * RV.NowProject.blockSize,rect.right,rect.bottom);
        }else if(dir == 7){//右上
            atkRect = new IRect(rect.left,rect.top - _sf.atkDis * RV.NowProject.blockSize,rect.right  + _sf.atkDis * RV.NowProject.blockSize ,rect.bottom);
        }
        return atkRect;
    };
    /**
     * 加速跑
     */
    this.speedUp = function(){
        if(actionJump || actionMove || _sf.stiffTime > 0) return;
        isRun = true;
    };
    /**
     * 获得有效伤害判定区域
     */
    this.getValidRect = function(){
        var temp = character.getCharactersRect();
        var temp2 = character.getDefRect();
        validRect.left = temp.left;
        validRect.right = temp.right;
        validRect.top = temp.bottom - (temp2.height - (temp2.dy * 2));
        validRect.bottom = temp.bottom;
        return validRect;
    };
    /**
     * 获得角色判定区域
     * @returns {IRect}
     */
    this.getUserRect = function(){
        return character.getCharactersRect();
    };
    /**
     * 获得显示区域
     * @returns {*|IRect}
     */
    this.getShowRect = function(){
        return character.getSpirte().GetRect();
    };
    /**
     * 获得角色x y坐标
     * @returns {{x, y}}
     */
    this.getXY = function(){
        return {
            x : character.x,
            y : character.y
        }
    };
    /**
     * 获得角色character对象
     * @returns {LCharacters}
     */
    this.getCharacter = function(){
        return character;
    };
    /**
     * 获得角色朝向
     * @returns {number}
     */
    this.getDir = function(){
        return character.getDir();
    };
    /**
     * 是否处于攻击动作
     * @returns {boolean}
     */
    this.atking = function(){
        return character.getActionIndex() == 3 || character.getActionIndex() == 4 ;
    };
    /**
     * 设置角色动作
     * @param action 动作列表
     * @param isIgnore 是否忽略不能执行的动作
     * @param isLoop 是否循环动作
     */
    this.setAction = function(action,isIgnore,isLoop){
        if(this.actionStart) return;
        actionLoop = isLoop;
        actionIgnore = isIgnore;
        for(var i = 0;i<action.length;i++){
            actionList.push(action[i]);
        }
        if(actionList.length > 0){
            this.actionStart = true;
        }
        oldRate = character.actionRate;
        oldSpeed = _sf.baseSpeed;
        oldLock = _sf.actionLock;
        oldGravity = _sf.IsGravity;
    };

    /**
     * 停止角色动作
     */
    this.stopAction = function(){
        if(!this.actionStart) return;
        _sf.IsGravity = oldGravity;
        _sf.baseSpeed = oldSpeed;
        character.actionRate = oldRate;
        actionPos = -1;
        actionList = [];
        actionWait = 0;
        actionJump = false;
        actionMove = false;
        _sf.actionStart = false;
    };

    /**
     * 受伤处理
     * @param type
     * @param num
     */
    this.injure = function(type,num){
        if(((typeof (num) == "object"|| num > 0) && _sf.invincibleTime > 0) || _sf.isDie) return;
        if(_sf.InjuredDo != null){
            _sf.InjuredDo(type,num);
        }

    };
    /**
     * 硬直处理
     * @param time 硬直时间
     */
    this.stiff = function(time){
        if(!_sf.superArmor){
            _sf.stiffTime = time;//硬直
            _sf.skillChant = false;
            character.getSpirte().flash(new IColor(255,0,0,255),20);
            if(character.haveActionIndex(5) && !_sf.actionLock){
                character.setAction(5,false,true,true);
            }
        }else{
            character.getSpirte().flash(new IColor(255,255,100,255),20);
        }

    };
    /**
     * 无敌开始
     * @param time 无敌时间
     */
    this.invincible = function(time) {
        _sf.invincibleTime = time;
        addinjureAction(_sf.invincibleTime);
    };
    /**
     * 无敌结束
     */
    this.endIncible = function(){
        _sf.invincibleTime = 0;
        character.getSpirte().stopAnim();
    };

    /**
     * 死亡处理
     */
    this.deathDo = function(){
        _sf.isDie = true;
        if(_sf.nowSkill != null){
            _sf.superArmor = false;
            _sf.nowSkill.stopSkill();
            _sf.nowSkill.update();
            _sf.nowSkill = null;
        }
        character.getSpirte().pauseAnim();
        character.getSpirte().stopAnim();
        if(character.haveActionIndex(6)){
            character.actionCall = null;
            character.setAction(6,false,true,false);
            character.actionCall = function(){
                var sp = character.getSpirte();

                sp.fadeTo(0,40);
                character.actionCall = null;
            };
        }else{
            character.getSpirte().visible = false;
        }
        if(_sf.DieDo != null){
            _sf.DieDo();
        }
    };

    //==================================== 私有函数 ===================================

    /**
     * 角色移动
     */
    function actorMove(){
        speedRecovery();
        //动作效验与修正
        if(!_sf.actionLock && !_sf.skillChant){
            if(isAtk){
                if(isMove){
                    character.setAction(4,false,true,true);
                }else{
                    character.setAction(3,false,true,true);
                }
                isAtk = false;
            }else if(isRun && isMove){//跑动场合
                character.setAction(2,false);
            }else if(isMove){//行走场合
                character.setAction(1,false);
            }else{//站立场合
                waitJump();
                if(jumpWait == 0){
                    jumpTimes = 0;
                }
                isJump = false;
                character.setAction(0,false);
            }
        }
        character.resetPublicBlock();
        if(_sf.Speed[1] != 0 && _sf.Speed[0] != 0) {
            character.selfMove = 3;
        }else if(_sf.Speed[1] != 0){
            character.selfMove = 1;
        }else if(_sf.Speed[0] != 0){
            character.selfMove = 2;
        }else{
            character.selfMove = 0;
        }
        character.x += _sf.Speed[1];
        character.y += _sf.Speed[0];

        moveWait += (Math.abs(_sf.Speed[1]) || Math.abs(_sf.Speed[0]));
        if(moveWait > 10){
            moveWait = 0;
            if(_sf.camp == 0){
                RV.GameData.step += 1;
            }
            _sf.moveNum += 1;
        }

        if(character.CannotMoveY && !isJumpBlock()){
            _sf.Speed[0] = 0;
        }
    }

    /**
     * 角色碰撞到敌人造成伤害
     */
    function updateEnemyCollision(){
        if(_sf.camp == 0){//主角才检测
            var enemy = RV.NowMap.getEnemys();
            for(var i = 0;i < enemy.length;i++){
                if(enemy[i].getActor().camp == 1 && enemy[i].visible && enemy[i].getData().isContactInjury && !enemy[i].getActor().isDie
                    && enemy[i].getRect().intersects(character.getCharactersRect())){
                    _sf.injure(3,enemy[i]);
                }
            }
        }
    }

    /**
     * 角色移动数据修正
     */
    function speedRecovery(){
        //y方向修正
        if(_sf.Speed[0] > 0){
            if(character.BlockContact == 1){
                _sf.Speed[0] -= 0.01;
            }else{
                _sf.Speed[0] -= 0.15;
            }
            if(_sf.Speed[0] < 0){
                _sf.Speed[0] = 0;
            }
        }else if(_sf.Speed[0] < 0){
            if(character.BlockContact == 1){
                _sf.Speed[0] += 0.01;
            }else{
                _sf.Speed[0] += 0.15;
            }
            if(_sf.Speed[0] > 0){
                _sf.Speed[0] = 0;
            }
        }else{
            _sf.Speed[0] = 0;
        }
        //x方向修正
        if(_sf.Speed[1] > 0){
            if(character.BlockContact == 1){
                _sf.Speed[1] -= 0.01;
            }else{
                _sf.Speed[1] -= 0.15;
            }
            if(_sf.Speed[1] < 0){
                _sf.Speed[1] = 0;
            }
        }else if(_sf.Speed[1] < 0){
            if(character.BlockContact == 1){
                _sf.Speed[1] += 0.01;
            }else{
                _sf.Speed[1] += 0.15;
            }
            if(_sf.Speed[1] > 0){
                _sf.Speed[1] = 0;
            }
        }else{
            _sf.Speed[1] = 0;
        }
    }

    /**
     * 是否可以跳跃
     * @returns {boolean|*} 是否可以跳跃
     */
    function isCanJump(){
        return (character.IsInSand || (_sf.JumpTimes == -1 || jumpTimes < _sf.JumpTimes )) ;
    }

    /**
     * 跳跃冷却
     */
    function waitJump(){
        if(jumpWait >= 0){
            jumpWait -= 1;
        }
    }

    /**
     * 角色交互块处理
     */
    function updateBlock(){
        //块的事件处理 只有控制角色可以出发
        if(_sf == RV.NowMap.getActor()){
            if(character.InteractionBlockContact != null){
                character.InteractionBlockContact.doEvent(1);
            }
            if(character.InteractionBlockBelow != null){
                character.InteractionBlockBelow.doEvent(3);
                if(character.InteractionBlockBelow.getData().isJump){
                    character.InteractionBlockBelow.doEvent(5);
                }

            }
        }
        //弹性块
       if(isJumpBlock()){
            _sf.Speed[0] *= -4;
            _sf.Speed[1] *= -4;
            //为防止两个弹跳块相互碰撞，加速度过快，所以再次修正一次速度
            if(_sf.Speed[1] > 30){
                _sf.Speed[1] = 30;
            }else if(_sf.Speed[1] < -30){
                _sf.Speed[1] = -30;
            }
            if(_sf.Speed[0] > 30){
                _sf.Speed[0] = 30;
            }else if(_sf.Speed[0] < -30){
                _sf.Speed[0] = -30;
            }
            character.InteractionBlockBelow = null;
            character.InteractionBlockContact = null;

        }
        //消失块
        if(character.InteractionBlockBelow != null && character.InteractionBlockBelow.getData().isVanish){
            character.InteractionBlockBelow.disappear();
            character.InteractionBlockBelow = null;
        }
    }

    /**
     * 是否是弹跳块
     * @returns {boolean}
     */
    function isJumpBlock(){
        return character.InteractionBlockContact != null && character.InteractionBlockContact.getData().isJump;
    }

    /**
     * 死亡判定与伤害判定 回调给父级
     */
    function death(){
        if(!_sf.isDie && ((RV.NowSet.setAll.blockDieToDie && ((character.BlockBelow == 3 || character.BlockContact == 3) || //碰触到死亡块
            (character.InteractionBlockContact != null && character.InteractionBlockContact.getData().isDie)))  ||
            character.getSpirte().y >= data[0].length * RV.NowProject.blockSize || character.isSandDie ||
            (RV.NowMap.viewMove && RV.NowMap.viewDir == 0 && character.getSpirte().y >= Math.abs(view.oy) + view.height) ||
            (RV.NowMap.viewMove && RV.NowMap.viewDir == 1 && character.getSpirte().y + character.getSpirte().height < Math.abs(view.oy) - 100) )){
            _sf.deathDo();
        }else if(_sf.invincibleTime <= 0 &&( (!RV.NowSet.setAll.blockDieToDie && ((character.BlockBelow == 3 || character.BlockContact == 3) || //碰触到死亡块
            (character.InteractionBlockContact != null && character.InteractionBlockContact.getData().isDie)))) ){
            var num = 0;
            if(RV.NowSet.setAll.blockDieType == 0){
                num = RV.NowSet.setAll.blockDieNum1;
            }else{
                num = RV.NowSet.setAll.blockDieNum2 / 100;
            }
            if(character.InteractionBlockContact != null){
                character.InteractionBlockContact = null;
            }
            if(character.InteractionBlockContact != null){
                character.InteractionBlockContact = null;
            }
            if(character.BlockBelow != null){
                character.BlockBelow = null;
            }
            if(character.BlockContact != null){
                character.BlockContact = null;
            }
            _sf.injure(RV.NowSet.setAll.blockDieType,num);
        }
    }

    /**
     * 受伤效果
     * @param time
     */
    function addinjureAction(time){
        character.getSpirte().flash(IColor.Black(),1);
        var times = parseInt(time / 60);
        if(character.getSpirte().actionList.length > 0) return;
        for(var i = 0;i<times;i++){
            character.getSpirte().addAction(action.fade,1,0.5,20);
            character.getSpirte().addAction(action.wait,10);
            character.getSpirte().addAction(action.fade,0.5,1,20);
            character.getSpirte().addAction(action.wait,10);
            character.getSpirte().addAction(action.fade,1,0.5,20);
            character.getSpirte().addAction(action.wait,10);
            character.getSpirte().addAction(action.fade,0.5,1,20);
            character.getSpirte().addAction(action.wait,10);
            character.getSpirte().addAction(action.fade,1,0.5,20);
            character.getSpirte().addAction(action.wait,10);
            character.getSpirte().addAction(action.fade,0.5,1,20);
            character.getSpirte().addAction(action.wait,10);
        }

    }
    /**
     * 移动指令处理
     */
    function updateAction(){
        if(!_sf.actionStart || actionList.length <= 0) return;
        if(actionWait > 0){
            actionWait -= 1;
            return;
        }
        if(actionJump){
            var tempSpeed = _sf.baseSpeed;
            if(actionJumpHeightY - actionJumpHeight > RV.NowProject.blockSize * 1.5){
                tempSpeed = _sf.baseSpeed / ( Math.abs(actionJumpHeightY - actionJumpHeight) / (RV.NowProject.blockSize * 1.5));
            }

            if(moveDir == 0){//左跳
                if(tempJumpX == "noX"){
                    character.x += tempSpeed;
                }else{
                    tempJumpX += tempSpeed;
                }
            }else if(moveDir == 1){
                if(tempJumpX == "noX"){
                    character.x -= tempSpeed;
                }else{
                    tempJumpX += tempSpeed;
                }
            }else if(moveDir == -1){
                tempJumpX += tempSpeed;
            }
            var tempy = actionJumpHeightA * Math.pow(character.x - actionJumpHeightX,2) + actionJumpHeight;
            if(tempJumpX != "noX"){
                tempy = actionJumpHeightA * Math.pow(tempJumpX  - actionJumpHeightX,2) + actionJumpHeight;
            }
            character.y = tempy;
            if((moveDir == 1 && character.x != actionJumpHeightX && character.x <= moveDis) ||
                (moveDir == 0 && character.x != actionJumpHeightX && character.x >= moveDis) ||
                (moveDir == -1 && character.y <= actionJumpHeight) ||
                (tempJumpX != "noX" && tempJumpX >= moveDis) ){
                _sf.IsGravity = oldGravity;
                _sf.actionLock = oldLock;
                actionJump = false;
            }
            if(character.CannotMoveX || character.CannotMoveY){
                _sf.IsGravity = oldGravity;
                _sf.actionLock = oldLock;
                actionJump = false;
            }
            return;
        }
        if(actionMove){
            if(_sf.baseSpeed > 2) isRun = true;
            var mindir = -1;
            if(moveDir == 0){
                if(moveDis <= character.y){
                    _sf.moveUp();
                }else{
                    actionMove = false;
                }
            }else if(moveDir == 1){
                if(moveDis >= character.y){
                    _sf.moveDown();
                }else{
                    actionMove = false;
                }
            }else if(moveDir == 2){
                if(moveDis <= character.x){
                    _sf.moveLeft();
                }else{
                    actionMove = false;
                }
            }else if(moveDir == 3){
                if(moveDis >= character.x){
                    _sf.moveRight();
                }else{
                    actionMove = false;
                }
            }else if(moveDir == 5){//靠近主角
                var actor = RV.NowMap.getActor().getCharacter();
                if(character.y > actor.y + RV.NowProject.blockSize && character.x > actor.x + RV.NowProject.blockSize){
                    _sf.moveLeftUp();
                    mindir = 4
                }else if(character.y > actor.y + RV.NowProject.blockSize && character.x < actor.x  - RV.NowProject.blockSize){
                    _sf.moveRightUp();
                    mindir = 4
                }else if(character.y < actor.y - RV.NowProject.blockSize && character.x < actor.x  - RV.NowProject.blockSize){
                    _sf.moveRightDown();
                    mindir = 4
                }else if(character.y < actor.y - RV.NowProject.blockSize && character.x > actor.x + RV.NowProject.blockSize){
                    _sf.moveLeftDown();
                    mindir = 4
                }else if(character.y > actor.y + RV.NowProject.blockSize){
                    _sf.moveUp();
                    mindir = 0;
                }else if(character.y < actor.y - RV.NowProject.blockSize){
                    _sf.moveDown();
                    mindir = 1;
                }else if(character.x > actor.x + RV.NowProject.blockSize){
                    _sf.moveLeft();
                    mindir = 2;
                }else if(character.x < actor.x  - RV.NowProject.blockSize){
                    _sf.moveRight();
                    mindir = 3;
                }
                moveDis -= Math.max(Math.abs(_sf.Speed[1]) , Math.abs(_sf.Speed[0]) );

                if(moveDis <= 0){
                    actionMove = false;
                }

            }
            if(actionIgnore && ((moveDir == 2 || moveDir == 3 || mindir == 2 || mindir == 3 || mindir == 4) && character.CannotMoveX)
                || ((moveDir == 0 || moveDir == 1 || mindir == 0 || mindir == 1 || mindir == 4) && character.CannotMoveY)){
                actionMove = false;
            }
            //刷新移动
            return;
        }
        actionPos += 1;
        if(actionPos > actionList.length - 1){
            if(actionLoop){
                actionPos = 0;
            }else{
                _sf.IsGravity = oldGravity;
                _sf.baseSpeed = oldSpeed;
                character.actionRate = oldRate;
                actionPos = -1;
                actionList = [];
                _sf.actionStart = false;
                return;
            }
        }
        nowAction = actionList[actionPos];
        if(nowAction.code == 4101){//移动

            moveDir = parseInt(nowAction.args[0]);
            if(moveDir == 4){//随机
                moveDir = RF.RandomChoose([0,1,2,3]);
            }else if(moveDir == 5){//主角
                if(_sf == RV.NowMap.getActor()){//主角不能自己靠近自己
                    return;
                }
            }else if(moveDir == 6){//前进
                if(_sf.getDir() == 0 || _sf.getDir() == 4 || _sf.getDir() == 5){
                    moveDir = 1;
                }else if(_sf.getDir() == 3 || _sf.getDir() == 6 || _sf.getDir() == 7){
                    moveDir = 0;
                }else if(_sf.getDir() ==1){
                    moveDir = 2;
                }else if(_sf.getDir() == 2){
                    moveDir = 3;
                }
            }else if(moveDir == 7){//后退
                if(_sf.getDir() == 0 || _sf.getDir() == 4 || _sf.getDir() == 5){
                    moveDir = 0;
                }else if(_sf.getDir() == 3 || _sf.getDir() == 6 || _sf.getDir() == 7){
                    moveDir = 1;
                }else if(_sf.getDir() ==1){
                    moveDir = 3;
                }else if(_sf.getDir() == 2){
                    moveDir = 2;
                }
            }
            if(nowAction.args[2] == "0"){
                moveDis = parseInt(nowAction.args[1]) * RV.NowProject.blockSize;
            }else {
                moveDis = parseInt(nowAction.args[1]);
            }
            if(moveDir == 0){//上移动
                moveDis = character.y - moveDis;
            }else if(moveDir == 1){//下
                moveDis = character.y + moveDis;
            }else if(moveDir == 2){//左
                moveDis = character.x - moveDis;
            }else if(moveDir == 3){//右
                moveDis = character.x + moveDis;
            }
            actionMove = true;
        }else if(nowAction.code == 4102){//跳跃
            oldLock = _sf.actionLock;
            oldGravity = _sf.IsGravity;
            tempJumpX = "noX";
            var y = 0;
            if(nowAction.args[2] == "0"){
                moveDis = parseInt(nowAction.args[0]) * RV.NowProject.blockSize;
                y = parseInt(nowAction.args[1]) * RV.NowProject.blockSize;
            }else{
                moveDis = parseInt(nowAction.args[0]);
                y = parseInt(nowAction.args[1]);
            }
            y = y + character.y;
            actionJumpHeight = parseInt(Math.min(character.y , y )) - RV.NowProject.blockSize ;
            moveDis = character.x + moveDis;
            if(moveDis > character.x){
                actionJumpHeightX = character.x +  (moveDis - character.x) / 2;
            }else {
                actionJumpHeightX =  moveDis +  (character.x - moveDis) / 2
            }

            if(moveDis > character.x){
                moveDir = 0;
            }else if(moveDis == character.x){
                moveDir = -1;
            }else{
                moveDir = 1;
            }
            actionJumpHeightY = character.y;
            if(character.x == actionJumpHeightX){
                actionJumpHeightA = (character.y - actionJumpHeight) / Math.pow((character.x - (actionJumpHeightX + 32)),2);
                tempJumpX = character.x - 32;
            }else{
                actionJumpHeightA = (character.y - actionJumpHeight) / Math.pow((character.x - actionJumpHeightX),2);
            }
            actionJump = true;
            character.setAction(1,false);
            _sf.actionLock = true;
            _sf.IsGravity = false;
        }else if(nowAction.code == 4104){//更改速度
            _sf.baseSpeed = 1 + (parseInt(nowAction.args[0]) - 1) * 0.5;
            oldSpeed = _sf.baseSpeed;
        }else if(nowAction.code == 4105){//更改速率
            _sf.actionRate = parseInt(nowAction.args[0]);
            oldRate =  _sf.actionRate;
        }else if(nowAction.code == 4106){//更改形象
            var res = RV.NowRes.findResActor(parseInt(nowAction.args[0]));
            if(res != null){
                character.changeImage(res);
            }
        }else if(nowAction.code == 4107){//更改朝向
            var type = parseInt(nowAction.args[0]);
            if(type < 8){
                character.setDir(type);
            }else if(type == 8 && _sf != RV.NowMap.getActor()){//面朝
                var dx = character.x - RV.NowMap.getActor().getCharacter().x;
                var dy = character.y - RV.NowMap.getActor().getCharacter().y;
                if(Math.abs(dx) > Math.abs(dy)){
                    if(dx > 0){
                        character.setDir(1);
                    }else{
                        character.setDir(2);
                    }
                }else{
                    if(dy > 0){
                        character.setDir(3);
                    }else{
                        character.setDir(0);
                    }
                }
            }else if(type == 9 && _sf != RV.NowMap.getActor()){//背朝
                dx = character.x - RV.NowMap.getActor().getCharacter().x;
                dy = character.y - RV.NowMap.getActor().getCharacter().y;
                if(Math.abs(dx) > Math.abs(dy)){
                    if(dx > 0){
                        character.setDir(2);
                    }else{
                        character.setDir(1);
                    }
                }else{
                    if(dy > 0){
                        character.setDir(0);
                    }else{
                        character.setDir(3);
                    }
                }
            }else if(type == 10){//随机
                character.setDir(rand(0,8));
            }else if(type == 11){//颠倒
                var temp = [3,2,1,0,7,6,5,4];
                character.setDir(temp[character.getDir()]);
            }
        }else if(nowAction.code == 4108){//更改不透明度
            character.getSpirte().opacity = parseInt(nowAction.args[0]) / 255;
        }else if(nowAction.code == 4109){//固定朝向ON
            character.fixedOrientation = true;
        }else if(nowAction.code == 4110){//固定朝向OFF
            character.fixedOrientation = false;
        }else if(nowAction.code == 4111){//设置动作
            _sf.actionLock = true;
            character.setAction(parseInt(nowAction.args[0]),false,false,false,true);
        }else if(nowAction.code == 4114){//穿透ON
            character.CanPenetrate = true;
        }else if(nowAction.code == 4115){//穿透OFF
            character.CanPenetrate = false;
        }else if(nowAction.code == 4120){//复原动作
            _sf.actionLock = false;
            character.reSingleTime();
        }else if(nowAction.code == 4121){//非循环动作
            _sf.actionLock = true;
            character.setAction(parseInt(nowAction.args[0]),false,true,false,true);
        } else if(nowAction.code == 201){//等待
            actionWait = parseInt(nowAction.args[0]);
            isMove = false;
            isRun = false;
            isRSquat = false;
        }else if(nowAction.code == 503){//音效
            RV.GameSet.playSE("Audio/" + nowAction.args[0],parseInt(nowAction.args[1]));
        }
    }
}/**
 * Created by 七夕小雨 on 2019/4/8.
 * 关键帧动画逻辑执行类
 * @param res 动画资源
 * @param view 要演示动画的视窗
 * @param isSingle 动画是否只播放一次
 * @param actor 动画相对的actor
 * @param rect 动画相对的矩形
 */
function LAnim(res,view,isSingle,actor,rect){
    var _sf = this;
    //==================================== 公有属性 ===================================
    //动画播放完毕回调
    this.endDo = null;
    //动画tag
    this.tag   = null;
    //是否按actor位置进行坐标修正
    this.pointActor = false;
    //相对判断矩形
    this.userRect = rect;
    //==================================== 私有属性属性 ===================================
    //动画资源数据
    var data = res;

    //动画执行
    var animation = null;
    //动画图片
    var cofBitmap = null;
    //动画精灵
    var sprite = null;
    //动画播放间隔
    var animationWait = 0;
    var animationIndex = -1;
    //动画是否执行完毕
    var end = false;
    //动画行为
    var doList = [];

    if(data.anims != null && data.anims.length > 0){
        animation = data.anims[0];
        cofBitmap = new IBCof(RF.LoadCache("Animation/" + data.file),animation.x , animation.y , animation.width , animation.height);
        sprite = new ISprite(cofBitmap , data.point.type === 1 || (data.point.dir === 5) ? null : view);
        sprite.yx = 0.5;
        sprite.yy = 0.5;
        sprite.z = 500;
    }

    if(animation != null && animation.sound != "" && data.anims.length === 1){
        RV.GameSet.playSE("Audio/" + animation.sound,animation.volume);
    }

    Object.defineProperty(this, "x", {
        get: function () {
            if(sprite == null){
                return 0;
            }
            return sprite.x;
        },
        set: function (value) {
            if(sprite == null){
                return;
            }
            sprite.x = value;
        }
    });

    Object.defineProperty(this, "y", {
        get: function () {
            if(sprite == null){
                return 0;
            }
            return sprite.y;
        },
        set: function (value) {
            if(sprite == null){
                return;
            }
            sprite.y = value;
        }
    });

    /**
     * 主循环
     */
    this.update = function(){
        if(data.point.type === 0 && !this.pointActor){
            this.pointUpdate();
        }
        end = sprite == null || (!sprite.isAnim() && animationIndex >=  data.anims.length - 1);
        if(end && isSingle && this.endDo != null){
            this.endDo();
            this.endDo = null;
        }
        if(data.anims.length > 1){
            if(animationWait <= 0){
                animationIndex += 1;
                if(animationIndex >=  data.anims.length){
                    if(!isSingle || sprite.isAnim()){
                        animationIndex = 0;
                    }else{
                        return;
                    }
                }
                var tempR = data.anims[animationIndex];
                cofBitmap.x = tempR.x;
                cofBitmap.y = tempR.y;
                cofBitmap.width = tempR.width;
                cofBitmap.height = tempR.height;
                animationWait = tempR.time;

                if(tempR.sound != "" && data.anims.length > 1){
                    RV.GameSet.playSE("Audio/" + tempR.sound,tempR.volume);
                }

                for(var i = 0;i<data.actionList.length;i++){
                    if(doList.indexOf(animationIndex + 1) < 0 && data.actionList[i].index === animationIndex + 1){
                        var action = data.actionList[i];
                        if(action.isOpactiy){
                            sprite.fadeTo(action.opacity / 255,action.opacityTime);
                        }
                        if(action.isZoom){
                            sprite.scaleTo(action.zoomX / 100,action.zoomY / 100,action.zoomTime);
                        }
                        if(action.isFlash){
                            RV.NowCanvas.flash(new IColor(action.color[0],action.color[1],action.color[2],action.color[3]),action.flashTime);
                        }
                        if(action.isActorFlash){
                            if(actor != null){
                                var sp = null;
                                if(actor instanceof  LTrigger){
                                    sp = actor.getCharacter().getCharacter().getSpirte();
                                }else if(actor instanceof LActor){
                                    sp = actor.getCharacter().getSpirte();
                                }else if(actor instanceof LEnemy){
                                    sp = actor.getCharacter().getSpirte();
                                }else if(actor instanceof LInteractionBlock){
                                    sp = actor.getSprite();
                                }
                                if(sp != null){
                                    sp.flash(new IColor(action.actorColor[0],action.actorColor[1],action.actorColor[2],action.actorColor[3]),action.actorFlashTime);
                                }

                            }
                        }
                        if(isSingle){
                            doList.push(animationIndex + 1);
                        }

                    }

                }

            }else{
                animationWait -= 1;
            }
        }
    };
    /**
     * 刷新动画位置
     */
    this.pointUpdate = function() {
        var x = 0;
        var y = 0;
        var haveView = true;
        var point = data.point;
        if(point.type === 0){//相对坐标
            var rect = null;
            if(actor != null){
                if(actor instanceof  LTrigger){
                    rect = actor.getCharacter().getShowRect();
                }else if(actor instanceof LActor){
                    rect = actor.getShowRect();
                }else if(actor instanceof LEnemy){
                    rect = actor.getActor().getShowRect();
                }else if(actor instanceof LInteractionBlock){
                    rect = actor.getSprite().GetRect();
                }
            }else if(_sf.userRect != null){
                rect = _sf.userRect;
            }else{
                rect = new IRect(1,1,1,1);
            }
            if(data.anims.length > 0){
                var animation = data.anims[0];
                if(point.dir === 0){//中心
                    x = rect.x + (rect.width) / 2;
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 1){//上
                    x = rect.x + (rect.width) / 2;
                    y = rect.y + (animation.height * sprite.zoomY);
                }else if(point.dir === 2){//下
                    x = rect.x + rect.width / 2;
                    y = rect.bottom - (animation.height * sprite.zoomY);
                }else if(point.dir === 3){//左
                    x = rect.x + (animation.width * sprite.zoomX);
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 4){//右
                    x = rect.right - (animation.width * sprite.zoomX);
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 5){//画面
                    haveView = false;
                    x = RV.NowProject.gameWidth / 2;
                    y = RV.NowProject.gameHeight / 2;
                }
                if(animationIndex >= 0 && animationIndex < data.anims.length){
                    x += data.anims[animationIndex].dx;
                    y += data.anims[animationIndex].dy;
                }else if(animationIndex == -1 && data.anims.length > 0){
                    x += data.anims[0].dx;
                    y += data.anims[0].dy;
                }

            }
        }else{//绝对坐标
            haveView = false;
            x = point.x;
            y = point.y;
        }
        sprite.x = x;
        sprite.y = y;
        sprite.z = 9999;
    };

    this.pointUpdate();
    /**
     * 释放
     */
    this.dispose = function(){
        if(sprite == null) return;
        sprite.disposeMin();
    };
    /**
     * 获得动画精灵对象
     * @returns {*}
     */
    this.getSprite = function(){
        return sprite;
    };

    /**
     * 获得精灵矩形
     * @returns {*}
     */
    this.getRect = function(){
        return sprite.GetRect();
    };

    this.fadeTo = function(o,time){
        sprite.fadeTo(o,time);
    }

}/**
 * Created by 七夕小雨 on 2019/1/9.
 * 基础图块逻辑 主要用于承载有动态动画的图块
 * @param resBlock 资源对象
 * @param dataBlock 配置数据
 * @param viewport 承载视窗
 * @param x x坐标
 * @param y y坐标
 * @param z z图层
 */
function LBlock(resBlock , dataBlock, viewport  , x , y , z){

    var data = resBlock;
    var block = dataBlock;

    //动画帧相关
    var animWait = data.anim[0].time;
    var animIndex = 0;
    //生成绘制精灵
    var tempx = 0;
    var tempy = 0;
    var cof = null;

    var rect = new IRect(1,1,1,1);
    if(data.drawType == 0){
        cof = new IBCof(RF.LoadCache("Block/" + data.file) , data.anim[0].x, data.anim[0].y, data.anim[0].width, data.anim[0].height);
    }else if(data.drawType == 1){
        tempx = block.drawIndex % 8;
        tempy = parseInt(block.drawIndex / 8);
        cof = new IBCof(RF.LoadCache("Block/" + data.file), data.anim[0].x + tempx * RV.NowProject.blockSize,
            data.anim[0].y + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
    }else if(data.drawType == 2){
        tempx = block.drawIndex % 3;
        tempy = parseInt(block.drawIndex / 3);
        cof = new IBCof(RF.LoadCache("Block/" + data.file), data.anim[0].x + tempx * RV.NowProject.blockSize,
            data.anim[0].y + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
    }

    var sprite = new ISprite(cof , viewport);
    sprite.z = z;
    sprite.x = x * RV.NowProject.blockSize;
    sprite.y = y * RV.NowProject.blockSize;
    /**
     * 主刷新
     */
    this.update = function(){
        //动画刷新
        if(data.anim.length > 1){
            if(animWait == 0){
                animIndex += 1;
                if(animIndex >=  data.anim.length){
                    animIndex = 0;
                }
                var tempR = data.anim[animIndex];
                cof.x = tempR.x + tempx * RV.NowProject.blockSize;
                cof.y = tempR.y + tempy * RV.NowProject.blockSize;
                cof.width = RV.NowProject.blockSize;
                cof.height = RV.NowProject.blockSize;
                animWait = tempR.time;
            }else{
                animWait -= 1;
            }
        }
    };
    /**
     * 获得精灵对象
     * @returns {ISprite}
     */
    this.getSprite = function(){
        return sprite;
    };
    /**
     * 释放
     */
    this.dispose = function(){
        sprite.disposeMin();
    };

    /**
     * 获得矩形
     * @returns {*}
     */
    this.getRect = function(){
        rect.left = sprite.x;
        rect.top = sprite.y;
        rect.right = sprite.x + sprite.width;
        rect.bottom = sprite.y + sprite.height;
        return rect;
    };
    /**
     * 替换表现图片
     * @param rBlock
     */
    this.changeBitmap = function(rBlock){
        data = rBlock;
        animWait = data.anim[0].time;
        animIndex = 0;
        tempx = 0;
        tempy = 0;
        cof = null;

        if(data.drawType == 0){
            cof = new IBCof(RF.LoadCache("Block/" + data.file) , data.anim[0].x, data.anim[0].y, data.anim[0].width, data.anim[0].height);
        }else if(data.drawType == 1){
            tempx = block.drawIndex % 8;
            tempy = parseInt(block.drawIndex / 8);
            cof = new IBCof(RF.LoadCache("Block/" + data.file), data.anim[0].x + tempx * RV.NowProject.blockSize,
                data.anim[0].y + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
        }else if(data.drawType == 2){
            tempx = block.drawIndex % 3;
            tempy = parseInt(block.drawIndex / 3);
            cof = new IBCof(RF.LoadCache("Block/" + data.file), data.anim[0].x + tempx * RV.NowProject.blockSize,
                data.anim[0].y + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
        }

        sprite.setBCof(cof);
    }

}/**
 * Created by 七夕小雨 on 2019/4/11.
 * 子弹逻辑处理
 * @param bullet 子弹配置数据
 * @param owner 子弹所属对象
 * @param view 子弹所属视窗
 * @param x 初始化x位置
 * @param y 初始化y位置
 * @param obj
 */
function LBullet( bullet , owner , view , x , y,obj){
    //子弹精灵组
    var sprite = [];
    //子弹动画组
    var anim = [];
    //设置子弹数据
    var data = bullet;
    var animData = null;
    //子弹角度校验
    var defAngle = data.angle;
    defAngle %= 360;
    if(owner.getDir() == 0){
        defAngle += 90;
    }else if(owner.getDir() == 1){
        defAngle += 180;
    }else if(owner.getDir() == 2){
    }else if(owner.getDir() == 3){
        defAngle -= 90;
    }else if(owner.getDir() == 4){
        defAngle += 135;
    }else if(owner.getDir() == 5){
        defAngle += 45
    }else if(owner.getDir() == 6){
        defAngle -= 135
    }else if(owner.getDir() == 7){
        defAngle -= 45;
    }
    defAngle %= 360;
    if(defAngle < 0) defAngle += 360;

    var baseAngle = (defAngle - (data.range / 2));
    var di = data.bulletNum - 1;
    if(di == 0) {
        di = 1;
        baseAngle = defAngle;
    }
    var minAngle = data.range / di;

    var actors = [];
    var time = data.time;
    if(time == -1){
        time = 999999;
    }

    //子弹发射完毕回调
    this.endDo = null;

    if(data.userPic){//如果是使用图片作为子弹的情况
        for(var i = 0;i< data.bulletNum;i++){
            var angle2 = Math.PI * (baseAngle + (minAngle * i)) / 180;
            var diffx = Math.cos(angle2) * data.bulletSpeed;
            var diffy = Math.sin(angle2) * data.bulletSpeed;
            var sp = new ISprite(RF.LoadCache("Animation/" + data.picFile),view);
            sp.x = x ;
            sp.y = y ;
            sp.yx = 0.5;
            sp.yy = 0.5;
            sp.z = 9999;

            if(data.bulletNum <= 1){
                sp.angle = defAngle;
            }else{
                sp.angle = baseAngle + (minAngle * i);
            }
            sp.tag = [diffx , diffy , sp.angle , sp.angle];
            sprite.push(sp);
        }

    }else if(data.userAnim) {//如果是动画作为子弹的情况
        for(i = 0;i< data.bulletNum;i++){
            angle2 = Math.PI * (baseAngle + (minAngle * i)) / 180;
            diffx = Math.cos(angle2) * data.bulletSpeed;
            diffy = Math.sin(angle2) * data.bulletSpeed;
            var am =  makerAnim(data.animId);
            var baseX = correctAnimX(x);
            var baseY = correctAnimY(y);
            am.userRect = new IRect(baseX - 5,baseY - 5,baseX + 5,baseY + 5);

            //am.pointActor = true;
            if(am instanceof LAnim){
                sp = am.getSprite();
                sp.z = 9999;
                var tempR = sp.GetRect();
                am.userRect = new IRect(baseX - tempR.width / 2,baseY - tempR.height / 2,baseX + tempR.width / 2,baseY + tempR.height / 2);
                if(sp != null){
                    if(data.bulletNum <= 1){
                        sp.angle = defAngle;
                    }else{
                        sp.angle = baseAngle + (minAngle * i);
                    }
                }
                am.tag = [diffx , diffy, sp.angle , sp.angle];
            }else{
                var angel = 0;
                if(data.bulletNum <= 1){
                    angel = defAngle;
                }else{
                    angel = baseAngle + (minAngle * i);
                }
                am.tag = [diffx , diffy, angel , angel];
            }
            am.pointUpdate();
            anim.push(am);
        }
    }

    /**
     * X坐标修正
     * @param value
     * @returns {number}
     */
    function correctAnimX(value){
        var point = animData.point;
        var x = 0;
        if(point.type == 0){//相对坐标
            if(animData instanceof DResAnimFrame){
                if(animData.anims.length > 0){
                    var animation = animData.anims[0];
                    if(point.dir == 0){//中心
                        x = value;
                    }else if(point.dir == 1){//上
                        x = value - (animation.height) / 2;
                    }else if(point.dir== 2){//下
                        x = value + (animation.height) / 2;
                    }else if(point.dir == 3){//左
                        x = value - (animation.width) / 2;
                    }else if(point.dir == 4){//右
                        x = value - (animation.width) / 2;
                    }else if(point.dir == 5){//画面
                        x = 0;
                    }
                }
            }else if(animData instanceof  DResAnimParticle){
                if(point.dir == 5){//画面
                    x = 0;
                }else{
                    x = value;
                }
            }
        }else{//绝对坐标
            x = point.x;
        }
        return x;
    }

    /**
     * y坐标修正
     * @param value
     * @returns {number}
     */
    function correctAnimY(value){
        var point = animData.point;
        var y = 0;
        if(point.type == 0){//相对坐标
            if(animData instanceof DResAnimFrame){
                if(animData.anims.length > 0){
                    var animation = animData.anims[0];
                    if(point.dir == 0){//中心
                        y = value + (animation.height) / 2;
                    }else if(point.dir == 1){//上
                        y = value;
                    }else if(point.dir== 2){//下
                        y = value - animation.height;
                    }else if(point.dir == 3){//左
                        y = value + (animation.height) / 2;
                    }else if(point.dir == 4){//右
                        y = value + (animation.height) / 2;
                    }else if(point.dir == 5){//画面
                        y = 0;
                    }
                }
            }else if(animData instanceof  DResAnimParticle){
                if(point.dir == 5){//画面
                    y = 0;
                }else{
                    y = value;
                }
            }
        }else{//绝对坐标
            y = point.y;
        }
        return y;
    }

    /**
     * 生成子弹所需的展示动画
     * @param animId 动画资源ID
     * @returns {*}
     */
    function makerAnim(animId){
        var data = RV.NowRes.findResAnim(animId);
        animData = data;
        var am = null;
        var haveView = true;
        var point = data.point;

        if(point.type == 0){//相对坐标
            if(owner != null){
                if(data instanceof DResAnimFrame){
                    if(data.anims.length > 0){
                        var animation = data.anims[0];
                        if(point.dir == 5){//画面
                            haveView = false;
                        }
                    }

                }else if(data instanceof  DResAnimParticle){
                    if(point.dir == 5){//画面
                        haveView = false;
                    }
                }
            }
        }else{//绝对坐标
            haveView = false;
        }

        if(data instanceof DResAnimFrame){
            am = new LAnim(data,haveView ? RV.NowMap.getView() : null,false);
        }else if(data instanceof  DResAnimParticle){
            am = new LParticle(data,haveView ? RV.NowMap.getView() : null,false);
        }

        return am;
    }

    /**
     * 主刷新
     */
    this.update = function(){

        if(time > 0){
            time -= 1;
        }

        if(sprite.length <= 0 && anim.length <= 0 && this.endDo != null ){
            this.endDo();
            this.endDo = null;
        }
        for(var i = sprite.length - 1;i >= 0;i--){
            var tag = sprite[i].tag;
            //追踪子弹
            if(data.isTrack){
                var tempA = getAngle(sprite[i].x,sprite[i].y);
                if(tempA == null){
                    var hd = sprite[i].tag[3] * (Math.PI/180);
                    sprite[i].x += Math.cos(hd) * data.bulletSpeed;
                    sprite[i].y += Math.sin(hd) * data.bulletSpeed;
                    sprite[i].angle = sprite[i].tag[3];
                }else{
                    var jd = parseInt(tempA * (180/Math.PI));
                    var tempJd = parseInt(sprite[i].tag[3] % 360);
                    sprite[i].tag[3] = tempJd;
                    if(tempJd != jd && tempJd - jd > 180){
                        sprite[i].tag[3] = (tempJd + 1) % 360;
                    }else if(tempJd != jd && tempJd - jd < -180){
                        sprite[i].tag[3]  -= 1;
                    }else if(tempJd != jd && tempJd - jd >= 0){
                        sprite[i].tag[3]  -= 1;
                    }else if(tempJd != jd && tempJd - jd < 0){
                        sprite[i].tag[3] = (tempJd + 1) % 360;
                    }
                    hd = sprite[i].tag[3] * (Math.PI/180);
                    sprite[i].x += Math.cos(hd) * data.bulletSpeed;
                    sprite[i].y += Math.sin(hd) * data.bulletSpeed;
                    sprite[i].angle = sprite[i].tag[3];
                }
            }else{
                sprite[i].x += tag[0];
                sprite[i].y += tag[1];
                if(data.isGravity){
                    tag[1] += (RV.GameData.gravityNum / 100) * RV.NowMap.getData().gravity;
                }
            }

            if(atkJudge(sprite[i].GetRect(),tag[0]) && !data.isPenetration){
                sprite[i].disposeMin();
                sprite.remove(sprite[i]);
                continue;
            }
            if(time == 10){
                sprite[i].fadeTo(0,10);
            }
            if(sprite[i].x  > RV.NowMap.getData().width * RV.NowProject.blockSize || sprite[i].x < 0 ||
                sprite[i].y > RV.NowMap.getData().height * RV.NowProject.blockSize || sprite[i].y < 0 || time <= 0){
                sprite[i].disposeMin();
                sprite.remove(sprite[i]);
            }


        }

        for(i = anim.length - 1;i >= 0;i--){

            tag = anim[i].tag;
            if(data.isTrack){
                tempA = getAngle(anim[i].userRect.left,anim[i].userRect.top);
                if(tempA == null){
                    hd = tag[3] * (Math.PI/180);
                    var sx =  Math.cos(hd) * data.bulletSpeed;
                    var sy = Math.sin(hd) * data.bulletSpeed;
                    anim[i].userRect.left += sx;
                    anim[i].userRect.right += sx;
                    anim[i].userRect.top += sy;
                    anim[i].userRect.bottom += sy;
                    if(anim[i] instanceof LAnim){
                        anim[i].getSprite().angle = tag[3];
                    }

                }else{
                    jd = parseInt(tempA * (180/Math.PI));
                    tempJd = parseInt(tag[3] % 360);
                    tag[3] = tempJd;
                    if(tempJd != jd && tempJd - jd > 180){
                        tag[3] = (tempJd + 1) % 360;
                    }else if(tempJd != jd && tempJd - jd < -180){
                        tag[3]  -= 1;
                    }else if(tempJd != jd && tempJd - jd >= 0){
                        tag[3]  -= 1;
                    }else if(tempJd != jd && tempJd - jd < 0){
                        tag[3] = (tempJd + 1) % 360;
                    }
                    hd = tag[3] * (Math.PI/180);

                    sx =  Math.cos(hd) * data.bulletSpeed;
                    sy = Math.sin(hd) * data.bulletSpeed;

                    anim[i].userRect.left += sx;
                    anim[i].userRect.right += sx;
                    anim[i].userRect.top += sy;
                    anim[i].userRect.bottom += sy;
                    if(anim[i] instanceof LAnim){
                        anim[i].getSprite().angle = tag[3];
                    }
                }
            }else{
                anim[i].userRect.left += tag[0];
                anim[i].userRect.right += tag[0];
                anim[i].userRect.top += tag[1];
                anim[i].userRect.bottom += tag[1];
                if(data.isGravity){
                    tag[1] += (RV.GameData.gravityNum / 100) * RV.NowMap.getData().gravity;
                }
            }
            anim[i].update();
            if(atkJudge(anim[i].userRect,tag[0]) && !data.isPenetration){
                anim[i].dispose();
                anim.remove(anim[i]);
                continue;
            }
            if(time == 10){
                if(anim[i] instanceof LAnim){
                    anim[i].fadeTo(0,10);
                }
            }
            if(anim[i].userRect.centerX > RV.NowMap.getData().width * RV.NowProject.blockSize || anim[i].userRect.centerX < 0 ||
                anim[i].userRect.centerY > RV.NowMap.getData().height * RV.NowProject.blockSize || anim[i].userRect.centerY < 0 || time <= 0){
                anim[i].dispose();
                anim.remove(anim[i]);
            }
        }


    };
    /**
     * 释放
     */
    this.dispose = function(){
        for(var i = sprite.length - 1;i >= 0;i--){
            sprite[i].disposeMin();
        }
        for(i = anim.length - 1;i >= 0;i--){
            anim[i].dispose();
        }
    };

    function getAngle(bx,by){
        var angle = 0;
        var PI = Math.PI;
        var dis = 999999;
        var endRect = null;
        if(owner.camp == 0 || owner.camp == 2){//操作角色
            for(var i = 0;i<RV.NowMap.getEnemys().length;i++){
                if(RV.NowMap.getEnemys()[i].getActor().camp == 1 && RV.NowMap.getEnemys()[i].visible && !RV.NowMap.getEnemys()[i].isDie && actors.indexOf(RV.NowMap.getEnemys()[i].getActor()) < 0){
                    var tempRect = RV.NowMap.getEnemys()[i].getRect();
                    //计算两点间距离
                    var tempDis = Math.abs( Math.sqrt( Math.pow((bx - tempRect.centerX),2) + Math.pow((by - tempRect.centerY),2) ) );
                    if(tempDis < dis){
                        dis = tempDis;
                        endRect = tempRect;
                    }
                }
            }
        }else if(owner.camp == 1){//敌人
            for(i = 0;i<RV.NowMap.getEnemys().length;i++){
                if(RV.NowMap.getEnemys()[i].getActor().camp == 2 && RV.NowMap.getEnemys()[i].visible && !RV.NowMap.getEnemys()[i].isDie && actors.indexOf(RV.NowMap.getEnemys()[i].getActor()) < 0){
                    tempRect = RV.NowMap.getEnemys()[i].getRect();
                    //计算两点间距离
                    tempDis = Math.abs( Math.sqrt( Math.pow((bx - tempRect.centerX),2) + Math.pow((by - tempRect.centerY),2) ) );
                    if(tempDis < dis){
                        dis = tempDis;
                        endRect = tempRect;
                    }
                }
            }

            //角色
            tempRect = RV.NowMap.getActor().getCharacter().getSpirte().GetRect();
            tempDis = Math.abs( Math.sqrt( Math.pow((bx - tempRect.centerX),2) + Math.pow((by - tempRect.centerY),2) ) );
            if(tempDis < dis){
                dis = tempDis;
                endRect = tempRect;
            }

        }
        //计算偏转角度
        if(endRect != null){
            var deltax = endRect.centerX - bx;
            var deltay = endRect.centerY - by;
            if(deltax == 0){
                if(endRect.centerY  == by){
                    deltax = 0.0001;
                }else{
                    deltax = -0.0001;
                }
            }
            if(deltay == 0){
                if(endRect.centerX  == bx){
                    deltay = 0.0001;
                }else{
                    deltay = -0.0001;
                }
            }
            if( deltax>0 && deltay>0 ){
                angle = Math.atan(Math.abs(deltay/deltax));           // 第一项限√
            }else if( deltax<0 && deltay<0 ){
                angle = PI + Math.atan(Math.abs(deltay/deltax)) ;       // 第三项限
            }else if( deltax<0 && deltay>0 ){
                angle = PI-Math.atan(Math.abs(deltay/deltax));          // 第二项限
            }else{
                angle = 2*PI-Math.atan(Math.abs(deltay/deltax));        // 第四项限 √
            }
            return angle;
        }
        return null;
    }

    /**
     * 攻击判定
     * @param rect 判定矩形
     * @param xSpeed 子弹飞行方向速度
     * @returns {boolean}
     */
    function atkJudge(rect,xSpeed){
        //主块判定
        if(!data.isPenetration){
            var bx = parseInt((rect.x + rect.width / 2) / (RV.NowProject.blockSize / 2));
            var by = parseInt((rect.y - rect.height / 2) / (RV.NowProject.blockSize / 2));
            var bb = RV.NowMap.getMapCurrent();
            if(bb[bx] != null && bb[bx][by] != null && bb[bx][by]){
                return true;
            }

        }
        //交互块判定
        var blocks = owner.getCharacter().getInteractionBlocks();
        if(blocks != null){
            for(i = 0;i<blocks.length;i++){
                if(blocks[i].isDestroy == false && blocks[i].getData().isDestroy == true && blocks[i].isCollision(rect)){
                    blocks[i].destroy();
                    return true;
                }
            }
        }

        var enemy = RV.NowMap.getEnemys();
        if(owner.camp == 0){//主角攻击

            for(i = 0;i<enemy.length;i++){
                if(enemy[i].getActor().camp == 1 && enemy[i].visible &&  enemy[i].getSpriteRect().intersects(rect) && !enemy[i].isDie && actors.indexOf(enemy[i].getActor()) < 0){
                    if(obj != null){
                        if(obj.value2 != 0){
                            enemy[i].getActor().injure(4 , obj.value2);
                        }
                        if(obj.value1 != 0){
                            if(obj.skill != null){
                                var oo = obj.skill.getBulletObj();
                                enemy[i].getActor().injure(2 , {
                                    crit : false,
                                    damage : obj.skill.endHurt(enemy[i]),
                                    repel : oo.repel,
                                    dir : oo.dir,
                                    fly : oo.fly
                                });
                            }else{
                                enemy[i].getActor().injure(0 , obj.value1);
                            }

                        }
                        for(var id in obj.buff){
                            if(obj.buff[id] == 1){
                                enemy[i].addBuff(id);
                            }else if(obj.buff[id] == 2){
                                enemy[i].subBuff(id);
                            }
                        }
                    }else{
                        enemy[i].getActor().injure(2 , RF.ActorAtkEnemy(enemy[i] , xSpeed > 0 ? 0 : 1) );
                    }
                    RV.NowMap.getActor().combatTime = 300;
                    enemy[i].getActor().combatTime = 300;
                    if(data.isPenetration){
                        actors.push(enemy[i].getActor());
                    }
                    RV.NowCanvas.playAnim(data.hitAnimId,null,enemy[i].getActor(),true);
                    return true;
                }
            }
        }else if(owner.camp == 1){//敌人

            for(i = 0;i<enemy.length;i++){
                if(enemy[i].getActor().camp == 2 && enemy[i].visible &&  enemy[i].getSpriteRect().intersects(rect) && !enemy[i].isDie && actors.indexOf(enemy[i].getActor()) < 0){
                    owner.combatTime = 300;
                    enemy[i].combatTime = 300;
                    if(obj instanceof LEnemy){
                        enemy[i].getActor().injure(2, RF.EnemyAtkEnemy(obj,enemy[i] ) );
                    }else if(obj.skill != null){
                        oo = obj.skill.getBulletObj();
                        enemy[i].getActor().injure(2 , {
                            crit : false,
                            damage : obj.skill.endHurt(enemy[i]),
                            repel : oo.repel,
                            dir : oo.dir,
                            fly : oo.fly
                        });
                    }
                    for(var id in obj.buff){
                        if(obj.buff[id] == 1){
                            enemy[i].addBuff(id);
                        }else if(obj.buff[id] == 2){
                            enemy[i].subBuff(id);
                        }
                    }
                    if(data.isPenetration){
                        actors.push(enemy[i].getActor());
                    }
                    RV.NowCanvas.playAnim(data.hitAnimId,null,enemy[i].getActor(),true);
                    return true;
                }
            }

            if(RV.NowMap.getActor().getCharacter().getSpirte().GetRect().intersects(rect) && actors.indexOf(RV.NowMap.getActor()) < 0){
                if(data.isPenetration){
                    actors.push(RV.NowMap.getActor());
                }
                owner.combatTime = 300;
                RV.NowMap.getActor().combatTime = 300;
                if(obj instanceof LEnemy){
                    RV.NowMap.getActor().injure(3,obj);
                }else if(obj.skill != null){
                    oo = obj.skill.getBulletObj();
                    RV.NowMap.getActor().injure(2 , {
                        crit : false,
                        damage : obj.skill.endHurt(RV.GameData.actor),
                        repel : oo.repel,
                        dir : oo.dir,
                        fly : oo.fly
                    });
                }
                for(var id in obj.buff){
                    if(obj.buff[id] == 1){
                        RV.GameData.actor.addBuff(id);
                    }else if(obj.buff[id] == 2){
                        RV.GameData.actor.subBuff(id);
                    }
                }
                if(data.isPenetration){
                    actors.push(RV.NowMap.getActor());
                }
                RV.NowCanvas.playAnim(data.hitAnimId,null,RV.NowMap.getActor(),true);
                return true;
            }
        }else if(owner.camp == 2){
            for(i = 0;i<enemy.length;i++){
                if(enemy[i].getActor().camp == 1 && enemy[i].visible &&  enemy[i].getRect().intersects(rect) && !enemy[i].isDie && actors.indexOf(enemy[i].getActor()) < 0){
                    owner.combatTime = 300;
                    enemy[i].combatTime = 300;
                    if(obj instanceof LEnemy){
                        enemy[i].getActor().injure(2, RF.EnemyAtkEnemy(obj,enemy[i] ) );
                    }else if(obj.skill != null){
                        oo = obj.skill.getBulletObj();
                        enemy[i].getActor().injure(2 , {
                            crit : false,
                            damage : obj.skill.endHurt(enemy[i]),
                            repel : oo.repel,
                            dir : oo.dir,
                            fly : oo.fly
                        });
                    }
                    for(var id in obj.buff){
                        if(obj.buff[id] == 1){
                            enemy[i].addBuff(id);
                        }else if(obj.buff[id] == 2){
                            enemy[i].subBuff(id);
                        }
                    }
                    if(data.isPenetration){
                        actors.push(enemy[i].getActor());
                    }
                    RV.NowCanvas.playAnim(data.hitAnimId,null,enemy[i].getActor(),true);
                    return true;
                }
            }
        }
        return false;
    }



}/**
 * Created by 七夕小雨 on 2019/3/18.
 * 画面元素承载场景
 */
function LCanvas(){

    var _sf = this;
    //场景静态化
    RV.NowCanvas = this;
    //文本框
    this.message = new LMessage();
    //对话框
    this.pop = new LMessagePop(RV.NowMap.getView());
    //选项框
    this.choice = new LChoice();
    //将对话框与文本框隐藏
    this.message.re();
    this.pop.none();
    //天气
    this.weather = new LWeather();
    this.weather.init();
    //图片
    this.pics = {};
    //动画
    this.anim = [];
    //子弹
    this.bullet = [];
    //技能
    this.skills = [];
    //闪烁图片
    var flash = null;
    //遮罩图片
    var mask = null;

    /**
     * 主循环
     */
    this.update = function(){
        for(var i = 0;i<this.anim.length;i++){
            this.anim[i].update();
        }
        for(i = 0;i<this.bullet.length;i++){
            this.bullet[i].update();
        }
        for(i = 0;i<this.skills.length;i++){
            this.skills[i].update();
        }
        this.message.updateDraw();
        this.pop.update();
        this.weather.update();
        this.choice.update();
        return this.choice.isW;
    };

    /**
     * 清理场景
     */
    this.clear = function(){
        _sf.message.re();
        _sf.pop.none();
        for(var key in this.pics){
            this.pics[key].dispose();
            delete this.pics[key];
        }
        for(var i = 0;i<this.bullet.length;i++){
            this.bullet[i].dispose();
            this.bullet[i] = null;
        }
        for(i = 0;i<this.skills.length;i++) {
            this.skills[i].dispose();
            this.skills[i] = null;
        }
        for(i = 0;i<this.anim.length;i++){
            this.anim[i].dispose();
            this.anim[i] = null;
        }
        this.pics = {};
        this.anim = [];
        this.bullet = [];
        this.skills = [];

    };

    /**
     * 释放场景
     */
    this.dispose = function(){
        this.message.dispose();
        this.pop.dispose();
        this.choice.dispose();
        this.weather.dispose();
        for(var key in this.pics){
            this.pics[key].dispose();
            delete this.pics[key];
        }
        for(i = 0;i<this.bullet.length;i++){
            this.bullet[i].dispose();
            this.bullet[i] = null;
        }

        for(i = 0;i<this.anim.length;i++){
            this.anim[i].dispose();
            this.anim[i] = null;
        }
        for(i = 0;i<this.skills.length;i++){
            this.skills[i].dispose();
            this.skills[i] = null;
        }
        this.pics = {};
        this.anim = [];
        this.bullet = [];
        this.skills = [];

        if(flash != null) {
            flash.dispose();
            flash = null;
        }
        if(mask != null) {
            mask.dispose();
            mask = null;
        }
    };

    /**
     * 闪烁
     * @param color 闪烁颜色
     * @param time 时间
     */
    this.flash = function(color,time){
        if(flash != null) {
            flash.dispose();
            flash = null;
        }
        flash = new ISprite(RV.NowProject.gameWidth,RV.NowProject.gameHeight,color);
        flash.z = 999999;
        flash.fade(1.0,0,time);
    };

    /**
     * 遮罩淡入
     * @param color 遮罩颜色
     * @param time 淡入事件
     */
    this.maskFadeIn = function(color,time){
        if(mask != null) {
            mask.dispose();
            mask = null;
        }
        mask = new ISprite(RV.NowProject.gameWidth,RV.NowProject.gameHeight,color);
        mask.z = 7000;
        mask.fade(0,1.0,time);
    };

    /**
     * 遮罩淡出
     * @param time 淡出时间
     */
    this.maskFadeOut = function(time){
        if(mask == null) return;
        mask.fadeTo(0 , time);
    };

    /**
     * 使用技能
     * @param actor 使用的LActor对象
     * @param id 技能配置ID
     * @param user 使用技能的承载体LEnemy或GActor
     * @param endDo 技能使用完毕回调
     */
    this.playSkill = function(actor , id , user , endDo){
        var data = RV.NowSet.findSkillId(id);
        if(data != null){
            var skill = new LSkill(actor , data , user);
            skill.endDo = function(){
                _sf.skills.remove(skill);
                if(endDo != null){
                    endDo();
                }
            };
            _sf.skills.push(skill);
        }else{
            if(endDo != null){
                endDo();
            }
        }

    };

    /**
     * 发射子弹
     * @param bulletId 子弹ID
     * @param actor 子弹所属LActor
     * @param x 子弹X
     * @param y 子弹Y
     * @param obj 附加
     */
    this.playBullet = function(bulletId,actor,x,y,obj){
        var data = RV.NowSet.findBullet(bulletId);
        if(data == null) return;
        var bullet = new LBullet(data,actor,RV.NowMap.getView(),x,y,obj);
        bullet.endDo = function(){
            _sf.bullet.remove(bullet);
        };
        this.bullet.push(bullet);
    };

    this.findAnim = function(tag){
        for(var i = 0;i<_sf.anim.length;i++){
            if(_sf.anim[i].tag == tag){
                return _sf.anim[i];
            }
        }
        return null;
    };

    /**
     * 播放动画
     * @param animId 动画ID
     * @param endFuc 动画结束回调
     * @param actor 动画相对LActor对象
     * @param isSingle 是否只播放一遍
     * @param rect 动画相对Rect
     * @param tag 绑定值
     * @returns {boolean}
     */
    this.playAnim = function(animId,endFuc,actor,isSingle,rect,tag){
        var data = RV.NowRes.findResAnim(animId);
        if(data == null) {
            if(endFuc != null){
                endFuc();
            }
            return;
        }
        var am = null;
        var haveView = true;
        var point = data.point;
        if(point.type == 0){//相对坐标
            if(point.dir == 5){//画面
                haveView = false;
            }
        }else{//绝对坐标
            haveView = false;
        }

        if(data instanceof DResAnimFrame){
            am = new LAnim(data,haveView ? RV.NowMap.getView() : null,isSingle,actor,rect);
        }else if(data instanceof  DResAnimParticle){
            am = new LParticle(data,haveView ? RV.NowMap.getView() : null,isSingle,actor,rect);
        }
        am.tag = tag;
        am.endDo = function(){
            am.dispose();
            _sf.anim.remove(am);
            if(endFuc != null){
                endFuc();
            }

        };

        if(am != null){
            this.anim.push(am);
            return true;
        }
        return false;
    }

}/**
 * Created by 七夕小雨 on 2019/1/10.
 * 行走图运行逻辑部分 派生LActor
 * @param resActor 行走图资源
 * @param view 行走图承载视窗
 * @param z z图层
 * @param mdata 基础图块
 * @param blocks 交互图块
 */
function LCharacters(resActor,view,z,mdata,blocks){
    var _sf = this;
    //==================================== 公有属性 ===================================
    //是否可以穿透
    this.CanPenetrate = false;
    //是否可以X方向移动
    this.CannotMoveX = false;
    //是否可以Y方向移动
    this.CannotMoveY = false;
    //是否在沙地
    this.IsInSand = false;
    //沙地系数
    this.SandNum = 0;
    //是否已经蒙死在沙地
    this.isSandDie = false;
    //该角色脚下的块
    this.BlockBelow = null;
    //该角色左右上碰触到的块
    this.BlockContact = null;
    //碰触到的交互块
    this.InteractionBlockContact = null;
    this.InteractionBlockBelow = null;
    //固定方向
    this.fixedOrientation = false;
    //固定动作
    this.fixedAction = false;
    //播放暂停动画
    this.playAnim = true;
    this.autoZ = true;
    this.topZ = false;
    //动画播放速率
    this.actionRate = 5;
    this.actor = null;
    //攻击回调
    this.atkCall = null;
    this.actionCall = null;
    this.shootCall = null;
    //特殊情况处理
    this.isActor = false;
    this.selfMove = 0;
    //==================================== 私有属性 ===================================
    //逻辑X，Y位置
    var selfX = 0, selfY = 0;
    //显示中心位置X，Y
    var showX = 0, showY = 0;
    //地图块数据
    var mapData = mdata;
    //资源数据
    var data = resActor;
    //方向
    var dir = 0;


    //判定高度、宽度
    var validWidth = 0;
    var validHeight = 0;
    var validX = 0;
    var validY = 0;

    var validRect = new IRect(1,1,1,1);
    var eventRect = new IRect(1,1,1,1);

    //读取所有的，可能的配置信息
    var cofs = [];
    var tempList = [];

    for(var i = 0;i<data.actionList.length;i++){
        if(data.actionList[i][0].length > 0){
            var animation = data.actionList[i][0][0];
            cofs[i] = new IBCof(RF.LoadCache("Characters/" + data.file + data.actionName[i]) , animation.x,animation.y,animation.width,animation.height);
        }else{
            cofs[i] = null;
        }
    }
    //当前动作DResAnim对象
    var nowAction = null;
    //当前动作IBof对象
    var nowCof = null;
    //图像离地高度（根据动作动态计算）
    var difHeight = 0;
    //动作交替时的零食变量
    var tempIndex = 0;
    //动画帧相关
    var isSingleTime = false;
    var isRestore = false;
    var oldAnimationIndex = -1;
    var animationWait = 0;
    var animationIndex = -1;
    //角色承载精灵
    var sprite = null;

    //如果存在动作帧则绘制
    if(cofs[0] != null){
        nowAction = data.actionList[0][0];
        nowCof = cofs[0];
        //离地高度计算
        difHeight = nowAction[0].height / 2;


        //自定义判定区域
        if(!nowAction[0].collisionRect.auto){
            validWidth = nowAction[0].collisionRect.width;
            validHeight = nowAction[0].collisionRect.height;
            validX = nowAction[0].collisionRect.x;
            validY = nowAction[0].collisionRect.y;
        }else{
            validWidth = Math.max(Math.floor(data.actionList[0][0][0].width / RV.NowProject.blockSize),1) * RV.NowProject.blockSize;
            validHeight = RV.NowProject.blockSize / 2;
        }

        sprite = new ISprite(cofs[0],view);
        sprite.z =z;
        //动画帧相关
        animationWait = nowAction[0].time;
        animationIndex = -1;
    }
    //==================================== 重写属性 ===================================
    /**
     * 设置角色X
     */
    Object.defineProperty(this, "x", {
        get: function () {
            return selfX;
        },
        set: function (value) {
            _sf.CannotMoveX = true;
            var dir = -1;
            if(value < selfX) dir = 0;//左
            if(value > selfX) dir = 1;//右
            var rect = null;
            var dx = 0;
            if(dir == 0){
                rect = _sf.getCharactersRect(value,selfY,validWidth,validHeight);
                dx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.left,true,rect);
                _sf.CannotMoveX = dx != 0 ;
                selfX = value + dx;
            }else if(dir == 1){
                rect = _sf.getCharactersRect(value,selfY,validWidth,validHeight);
                dx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.right,false,rect);
                _sf.CannotMoveX = dx != 0;
                selfX = value - dx;
            }else if(dir == -1 && _sf.isActor){
                rect = _sf.getCharactersRect(value,selfY,validWidth,validHeight);
                dx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.left,true,rect);
                _sf.CannotMoveX = dx != 0;
                selfX = value + dx;
                if(Math.abs(dx) > RV.NowProject.blockSize){
                    _sf.isSandDie = true;
                    return;
                }
                rect = _sf.getCharactersRect(value,selfY,validWidth,validHeight);
                var tempdx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.right,false,rect);
                if(tempdx != 0){
                    _sf.CannotMoveX = tempdx != 0;
                    selfX = value - tempdx;
                    if(Math.abs(tempdx) > RV.NowProject.blockSize){
                        _sf.isSandDie = true;
                        return;
                    }
                }


                showX = selfX + ( RV.NowProject.blockSize / 2);
                CorrectedPosition(showX,showY);
            }else if(!_sf.isActor){
                _sf.CannotMoveX = false;
            }
            if(dir != -1){
                showX = selfX + ( RV.NowProject.blockSize / 2);
                CorrectedPosition(showX,showY);
            }
        }
    });

    /**
     * 设置角色Y
     */
    Object.defineProperty(this, "y", {
        get: function () {
            return selfY
        },
        set: function (value) {
            _sf.CannotMoveY = true;
            var dir = -1;
            if(value > selfY) dir = 2; //下
            if(value < selfY) dir = 3; //上
            var rect = null;
            var dy = 0;
            if(dir == 2){
                rect = _sf.getCharactersRect(selfX,value,validWidth,validHeight);
                dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.bottom,false,rect);
                _sf.CannotMoveY = dy != 0;
                selfY = value - dy;
            }else if(dir == 3){
                rect = _sf.getCharactersRect(selfX,value,validWidth,validHeight);
                dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.top,true,rect);
                _sf.CannotMoveY = dy != 0;
                selfY = value + dy;
            }else if(dir == -1 && _sf.isActor){
                rect = _sf.getCharactersRect(selfX,value,validWidth,validHeight);
                dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.bottom,false,rect);
                _sf.CannotMoveY = dy != 0;
                selfY = value - dy;
                if(Math.abs(dy) > RV.NowProject.blockSize){
                    _sf.isSandDie = true;
                    return;
                }
                if(dy == 0){
                    rect = _sf.getCharactersRect(selfX,value,validWidth,validHeight);
                    dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.top,true,rect);
                    _sf.CannotMoveY = dy != 0;
                    selfY = value + dy;
                    if(Math.abs(dy) > RV.NowProject.blockSize){
                        _sf.isSandDie = true;
                        return;
                    }
                }
                showY = (selfY - difHeight) + RV.NowProject.blockSize
                CorrectedPosition(showX,showY);
            }else if(!_sf.isActor){
                _sf.CannotMoveY = false;
            }
            if(dir != -1){
                showY = (selfY - difHeight) + RV.NowProject.blockSize
                CorrectedPosition(showX,showY);
            }
        }
    });

    var selfBlock = null;
    if(IVal.DEBUG && sprite != null){
        selfBlock = new ISprite(new IBitmap.CBitmap(1,1),view);
        selfBlock.drawRect(new IRect(0,0,1,1),new IColor(125,125,0,125));
        selfBlock.zoomX = validWidth;
        selfBlock.zoomY = validHeight;
        selfBlock.z = sprite.z - 1;
    }

    //==================================== 公有函数 ===================================
    /**
     * 获得角色朝向
     */
    this.getDir = function(){
        return dir;
    };

    /**
     * 强制将角色设置到某位置
     * @param x
     * @param y
     */
    this.mustXY = function(x,y){
        selfX = x;
        selfY = y;
        resetShowXY();
        CorrectedPosition(showX,showY);
    };

    /**
     * 主刷新
     */
    this.updateBase = function(){

        //动画刷新
        if(nowAction.length >= 1 && this.playAnim){
            if(animationWait <= 0){
                animationIndex += 1;
                if(animationIndex >=  nowAction.length && !isSingleTime){
                    animationIndex = 0;
                }else if(animationIndex >=  nowAction.length && isSingleTime){

                    if(isRestore){
                        isSingleTime = false;
                        _sf.setAction(oldAnimationIndex);
                    }else{
                        animationIndex = nowAction.length - 1;
                    }
                    if(_sf.actionCall != null){
                        _sf.actionCall();
                    }

                }
                var tempR = nowAction[animationIndex];
                nowCof.x = tempR.x;
                nowCof.y = tempR.y;
                nowCof.width = tempR.width;
                nowCof.height = tempR.height;
                //更新判定区域
                if(!tempR.collisionRect.auto){
                    validWidth = tempR.collisionRect.width;
                    validHeight = tempR.collisionRect.height;
                    validX = tempR.collisionRect.x;
                    validY = tempR.collisionRect.y;
                }else{
                    _sf.resetValidSize();
                }
                //攻击回调
                if(tempR.points.length > 0 && this.shootCall != null){
                    this.shootCall(tempR.points);
                }
                if(tempR.effective && this.atkCall != null){
                    this.atkCall();
                }
                if(tempR.sound != "" && nowAction.length > 1){
                    RV.GameSet.playSE("Audio/" + tempR.sound,tempR.volume);
                }
                difHeight = nowAction[animationIndex].height / 2;
                resetShowXY();
                centerPoint(nowCof.width , nowCof.height,showX,showY);
                animationWait = tempR.time;
                CorrectedPosition(showX,showY);
            }else{
                animationWait -= (_sf.actionRate / 5);
                if(animationWait <= 0) animationWait = 0;
            }
        }
    };

    this.reSingleTime = function(){
        isSingleTime = false;
    };

    this.setInitData = function(m,b){
        mapData = m;
        blocks = b;
    };

    /**
     * 主释放
     */
    this.disposeBase = function(){
        if(sprite != null){
            sprite.disposeMin();
        }
        if(selfBlock != null){
            selfBlock.disposeMin();
        }
    };

    this.resetPublicBlock = function(){
        //碰触部分重置
        _sf.BlockBelow = null;
        _sf.BlockContact = null;
        _sf.InteractionBlockBelow = null;
        _sf.InteractionBlockContact = null;
    };

    /**
     * 设置角色朝向
     * @param isLeft
     */
    this.setLeftRight = function(isLeft){
        if(this.fixedOrientation) return;
        _sf.setDir(isLeft ? 1 : 2);
    };
    /**
     * 获取待机状态的矩形尺寸
     */
    this.getDefRect = function(){
        var a = data.actionList[0][dir];
        var tempR = a[0];
        return tempR;
    };

    /**
     * 获得角色ISprite对象
     * @returns {*}
     */
    this.getSpirte = function(){
        return sprite;
    };
    /**
     * 获得当前角色IBof对象
     * @returns {*}
     */
    this.getNowCof = function(){
        return nowCof;
    };

    this.getActionIndex = function(){
        return tempIndex;
    };

    this.haveActionIndex = function(index){
        return data.actionList[index] != null && data.actionList[index][dir].length > 0;
    };

    /**
     * 设置角色动作
     * 通配原则——
     * 1、必须要有待机动作
     * 2、如果没有行走动作，则替换为待机动作
     * 3、如果没有跑步动作，则替换为行走动作
     * 4、如果没有起跳动作，则替换为待机动作
     * 5、如果没有落地动作，则替换为待机动作
     * 6、如果没有下蹲动作，则替换为待机动作
     * 7、如果没有攻击动作，则替换为待机动作
     * 8、如果没有跳跃攻击动作，则替换为攻击动作
     * 9、如果没有下蹲攻击动作，则替换为攻击动作
     * 10、如果其他动画不存在，则均替换为待机动作
     * 11、如果没有待机动画，则该函数直接结束
     * @param index 寻找的动作Index 0待机 1行走 2跑动 3攻击 4移动射击 5受伤动作 6死亡动作 7及以上
     * @param isReviseSize 是否修正判定区域
     * @param isSingle 动作是否只播放一遍
     * @param isRestoreAction 动作播放完毕后是否还原
     * @param isMust 强制切换动作
     */
    this.setAction = function(index,isReviseSize,isSingle,isRestoreAction,isMust){
        if(index >= data.actionList.length){
            log("动作切换失败：设置动作不存在");
            return;
        }
        var must = isMust == null ? false : isMust;
        if(must){
            isSingleTime = false;
        }
        if(this.fixedAction || isSingleTime) return;
        if(tempIndex != index){

            var tempAction  = data.actionList[index];
            if(tempAction == null || tempAction[0].length <= 0){
                if(index == 0) return;
                var newIndex = 0;
                if(index == 2) newIndex = 1;
                if(index == 4) newIndex = 3;
                _sf.setAction(newIndex , isReviseSize,isSingle,isRestoreAction);
                return;
            }
            isSingleTime = isSingle == null ? false : isSingle;
            isRestore = isRestoreAction == null ? false : isRestoreAction;
            oldAnimationIndex = tempIndex;
            nowAction = data.actionList[index][dir];
            //方向容错
            if(nowAction.length <= 0) nowAction = data.actionList[index][0];
            var tempR = nowAction[0];
            animationWait = tempR.time;
            tempIndex = index;
            animationIndex = 0;
            nowCof = cofs[index];
            nowCof.x = tempR.x;
            nowCof.y = tempR.y;
            nowCof.width = tempR.width;
            nowCof.height = tempR.height;
            //单帧动画音效只播放一次，避免卡死
            if(tempR.sound != "" && nowAction.length == 1){
                RV.GameSet.playSE("Audio/" + tempR.sound,tempR.volume);
            }
            if(tempR.points.length > 0 && this.shootCall != null){
                this.shootCall(tempR.points);
            }
            if(tempR.effective && this.atkCall != null){
                this.atkCall();
            }
            sprite.setBCof(nowCof);
            difHeight = nowAction[0].height / 2;
            resetShowXY();
            var p = centerPoint(nowCof.width , nowCof.height,showX,showY);
            sprite.x = p[0] + nowAction[0].dx;
            sprite.y = p[1] + nowAction[0].dy;
            if(isReviseSize){
                //validWidth = Math.max(Math.floor(nowAction[0].width / RV.NowProject.blockSize),1) * RV.NowProject.blockSize;

                //validHeight = RV.NowProject.blockSize / 2;
                if(!tempR.collisionRect.auto){
                    validWidth = tempR.collisionRect.width;
                    validHeight = tempR.collisionRect.height;
                    validX = tempR.collisionRect.x;
                    validY = tempR.collisionRect.y;
                }else{
                    _sf.resetValidSize();
                }
            }
        }
    };

    this.setDir = function(d,isReviseSize){
        if(_sf.fixedOrientation) return;
        //如果行走图不是8方向则8方向指令转4方向
        if(d > data.actionList[tempIndex].length - 1){
            if(d == 4 || d == 5) d = 0;
            if(d == 6 || d == 7) d = 3;
        }
        if(d != dir && data.actionList[tempIndex][d].length > 0){
            dir = d;
            nowAction = data.actionList[tempIndex][dir];
            var tempR = nowAction[0];
            animationWait = tempR.time;
            animationIndex = 0;
            nowCof = cofs[tempIndex];
            nowCof.x = tempR.x;
            nowCof.y = tempR.y;
            nowCof.width = tempR.width;
            nowCof.height = tempR.height;
            //单帧动画音效只播放一次，避免卡死
            if(tempR.sound != "" && nowAction.length == 1){
                RV.GameSet.playSE("Audio/" + tempR.sound,tempR.volume);
            }
            if(tempR.points.length > 0 && this.shootCall != null){
                this.shootCall(tempR.points);
            }
            if(tempR.effective && this.atkCall != null){
                this.atkCall();
            }
            sprite.setBCof(nowCof);
            difHeight = nowAction[0].height / 2;
            resetShowXY();
            var p = centerPoint(nowCof.width , nowCof.height,showX,showY);
            sprite.x = p[0] + nowAction[0].dx;
            sprite.y = p[1] + nowAction[0].dy;
            if(isReviseSize){
                if(!tempR.collisionRect.auto){
                    validWidth = tempR.collisionRect.width;
                    validHeight = tempR.collisionRect.height;
                    validX = tempR.collisionRect.x;
                    validY = tempR.collisionRect.y;
                }else{
                    _sf.resetValidSize();
                }
            }
        }
    };

    /**
     * 重置判定区域
     */
    this.resetValidSize = function(){
        validWidth = Math.max(Math.floor(nowAction[0].width / RV.NowProject.blockSize),1) * RV.NowProject.blockSize;
        validHeight = RV.NowProject.blockSize / 2;
        validX = 0;
        validY = 0;
    };

    /**
     * 获得某个动作的判定尺寸
     * @param index 动画标号 0待机 1跳跃 2落地 3行走 4跑动 5下蹲 6攻击 7跳跃攻击 8下蹲攻击 9-17 其他动画1-9
     * @returns {Array} 返回尺寸数组 0宽度 1高度
     */
    this.getValidSize = function(index){
        var tempAction = data.actionList[index];
        if(tempAction == null || tempAction.length <= 0){
            if(index == 0) return [0,0];
            var newIndex = 0;
            if(index == 4) newIndex = 3;
            if(index == 7) newIndex = 6;
            if(index == 8) newIndex = 6;
            return _sf.getValidSize(newIndex);
        }
        if(data.actionList[index].length > 0){
            return [
                Math.max(Math.floor(data.actionList[index][0].width / RV.NowProject.blockSize),1) * RV.NowProject.blockSize - 15,
                data.actionList[index][0].height]
        }
        return [0,0];
    };

    function makeRectDatum(rectA , rectB , datum , dir){
        if(dir == 0 || dir == 1){//上下
            if(rectA.bottom >= rectB.top && rectA.top < rectB.top && Math.abs(rectA.left - rectB.right) >= 5 &&  Math.abs(rectA.right - rectB.left) >= 5 ){
                if(dir == 0){
                    return rectA.bottom - datum;
                }else{
                    return -(rectA.bottom - (datum - rectB.height));
                }

            }else if(rectA.top <= rectB.bottom && rectA.bottom > rectB.bottom && Math.abs(rectA.left - rectB.right) >= 5 &&  Math.abs(rectA.right - rectB.left) >= 5 ){
                if(dir == 0){
                    return -((datum + rectB.height) - rectA.top);
                }else{
                    return datum - rectA.top;
                }
            }else{
                return 0;
            }
        }else if(dir == 2 || dir == 3){//左右
            if(rectA.right >= rectB.left && rectA.left < rectB.left &&  Math.abs(rectA.top - rectB.bottom) >= 5 &&  Math.abs(rectA.bottom - rectB.top) >= 5){
                if(dir == 2){
                    return (rectA.right - datum);
                }else{
                    return (rectA.right - (datum - rectB.width)) * -1;
                }

            }else if(rectA.left <= rectB.right && rectA.right > rectB.right &&  Math.abs(rectA.top - rectB.bottom) >= 5 &&  Math.abs(rectA.bottom - rectB.top) >= 5){
                if(dir == 2){
                    return ((datum + rectB.width) - rectA.left) * -1;
                }else{
                    return (datum - rectA.left);
                }
            }else{
                return 0;
            }
        }
    }

    /**
     * 向上下移动的判定
     * @param startX 起始X判定
     * @param endX 终点X判定
     * @param datumY 基准Y
     * @param isUp 是否是上方向
     * @param rect 判定矩形
     * @returns {number} 偏差值
     */
    this.isCanMoveUpDown = function(startX,endX,datumY,isUp,rect){
        if(_sf.CanPenetrate) {  return 0; }
        _sf.isSandDie = false;
        var bY = parseInt(datumY / RV.NowProject.blockSize);
        var bX1 = parseInt(((startX + 1) / RV.NowProject.blockSize));
        var bX2 = parseInt(((endX - 1) / RV.NowProject.blockSize));

        var cY = parseInt(datumY / (RV.NowProject.blockSize / 2));
        var cX1 = parseInt(((startX + 1) / (RV.NowProject.blockSize / 2)));
        var cX2 = parseInt(((endX - 1) / (RV.NowProject.blockSize / 2)));

        //判定上下移动是否出框
        if(this.actor != null && !this.actor.IsGravity){
            if(isUp && datumY <= 0){
                return  datumY * -1;
            }else if(!isUp && datumY >= mapData[0].length * RV.NowProject.blockSize){
                return datumY - mapData[0].length * RV.NowProject.blockSize;
            }
        }
        if(bY < 0 || bY > mapData[0].length - 1 || bX1 < 0 || bX2 > mapData.length - 1) return 0;

        if(rect !=  null){

            var newRect = new IRect(rect.left + 1,rect.top + 1,rect.right - 1,rect.bottom);
            if(isUp){
                newRect.bottom -= 1;
            }
            var dy = 0;
            var tempInteractionBlocks = _sf.isHaveInteractionBlock(newRect);
            if(tempInteractionBlocks != null){
                for(i = 0;i<tempInteractionBlocks.length;i++){
                    var tempInteractionBlock = tempInteractionBlocks[i];
                    var tempRect = tempInteractionBlock.getRect();
                    if(isUp){
                        dy = makeRectDatum(tempRect,newRect,datumY,0);
                    }else{
                        dy = makeRectDatum(tempRect,newRect,datumY,1);
                    }
                    if(dy != 0) {
                        _sf.InteractionBlockContact = tempInteractionBlock;
                        if(!isUp){
                            _sf.InteractionBlockBelow = tempInteractionBlock;
                        }
                        return dy;
                    }
                }

            }

            var tempTriggers = _sf.collisionTrigger(newRect);
            for(i = 0;i<tempTriggers.length;i++){
                var tempTrigger = tempTriggers[i];
                if(isUp){
                    dy = makeRectDatum(tempTrigger,newRect,datumY,0);
                }else{
                    dy = makeRectDatum(tempTrigger,newRect,datumY,1);
                }
                if(dy != 0) return dy;
            }

            var tempEnemys = _sf.collisionEnemy(newRect);
            for(i = 0;i<tempEnemys.length;i++){
                var tempEnemy = tempEnemys[i];
                if(isUp){
                    dy = makeRectDatum(tempEnemy,newRect,datumY,0);
                }else{
                    dy = makeRectDatum(tempEnemy,newRect,datumY,1);
                }
                if(dy != 0) return dy;
            }
        }
        for(var i = bX1 ; i <= bX2 ; i++){
            if(mapData[i][bY] >= 0 ){
                _sf.BlockContact = mapData[i][bY];
            }
        }
        //碰撞
        if(_sf.selfMove == 2 || _sf.selfMove == 3){
            var current = RV.NowMap.getData().current;
            for(i = cX1; i <= cX2 ; i++){
                if(current[i] != null && current[i][cY] != null && current[i][cY]){
                    if(isUp){
                        return ((cY + 1) *(RV.NowProject.blockSize / 2)) - datumY;
                    }else{
                        return datumY - (cY * (RV.NowProject.blockSize / 2));
                    }
                }
            }
        }
        return 0;
    };

    /**
     * 向左右移动的判定
     * @param startY 起始Y
     * @param endY 终点Y
     * @param datumX 基准X
     * @param isLeft 是否是左方向
     * @param rect 判定矩形
     * @returns {number} 偏差值
     */
    this.isCanMoveLeftRight = function(startY,endY,datumX,isLeft,rect){
        if(_sf.isActor && RV.NowMap.viewMove){
            if(isLeft && datumX <= Math.abs(view.ox)){
                return Math.abs(view.ox) -datumX ;
            }else if(!isLeft && datumX >= Math.abs(view.ox) + view.width){
                return datumX - (Math.abs(view.ox) + view.width);
            }
        }
        if(_sf.CanPenetrate) { return  0; }
        _sf.isSandDie = false;
        var bX = parseInt(  datumX / RV.NowProject.blockSize);
        var bY1 = parseInt((startY + 1) / RV.NowProject.blockSize);
        var bY2 = parseInt((endY - 1) / RV.NowProject.blockSize);

        var cX = parseInt(  datumX / (RV.NowProject.blockSize / 2));
        var cY1 = parseInt((startY + 1) / (RV.NowProject.blockSize / 2));
        var cY2 = parseInt((endY - 1) / (RV.NowProject.blockSize / 2));
        //判定左右移动是否出框
        if(isLeft && datumX <= 0){
            return  datumX * -1;
        }else if(!isLeft && datumX >= mapData.length * RV.NowProject.blockSize){
            return datumX - mapData.length * RV.NowProject.blockSize;
        }
        if(bX < 0){
            return datumX * -1;
        }
        if(bX > mapData.length - 1){
            return datumX - mapData.length * RV.NowProject.blockSize;
        }
        if(bY1 < 0 || bY2 > mapData[0].length - 1) return 0;
        if(bY1 > 0 && mapData[bX][bY1 - 1] >= 3000 && mapData[bX][bY1] >= 3000){
            _sf.isSandDie = true;
        }
        if(rect != null){
            var newRect = new IRect(rect.left + 1,rect.top + 1,rect.right - 1,rect.bottom - 1);

            var dx = 0;
            var tempInteractionBlocks = _sf.isHaveInteractionBlock(newRect);
            if(tempInteractionBlocks != null){
                for(i = 0;i<tempInteractionBlocks.length;i++){
                    var tempInteractionBlock = tempInteractionBlocks[i];
                    var tempRect = tempInteractionBlock.getRect();
                    if(isLeft ){
                        dx = makeRectDatum(tempRect,newRect,datumX,2);
                    }else{
                        dx = makeRectDatum(tempRect,newRect,datumX,3);
                    }
                    if(dx != 0) {
                        _sf.InteractionBlockContact = tempInteractionBlock;
                        return dx;
                    }
                }
            }

            var tempTriggers = _sf.collisionTrigger(newRect);
            for(i = 0;i<tempTriggers.length;i++){
                var tempTrigger = tempTriggers[i];
                if(isLeft ){
                    dx = makeRectDatum(tempTrigger,newRect,datumX,2);
                }else{
                    dx = makeRectDatum(tempTrigger,newRect,datumX,3);
                }
                if(dx != 0) return dx;
            }

            var tempEnemys = _sf.collisionEnemy(newRect);
            for(i = 0;i<tempEnemys.length;i++){
                var tempEnemy = tempEnemys[i];
                if(isLeft ){
                    dx = makeRectDatum(tempEnemy,newRect,datumX,2);
                }else{
                    dx = makeRectDatum(tempEnemy,newRect,datumX,3);
                }
                if(dx != 0) return dx;
            }

        }
        for(var i = bY1; i <= bY2 ; i++){
            if(mapData[bX][i] >= 0){
                _sf.BlockContact = mapData[bX][i];
            }
        }
        //碰撞
        if(_sf.selfMove == 1 || _sf.selfMove == 3){
            var current = RV.NowMap.getData().current;
            for(i = cY1; i <= cY2 ; i++){
                if(current[cX] != null && current[cX][i] != null && current[cX][i]){
                    if(isLeft){
                        return ((cX + 1) * (RV.NowProject.blockSize / 2)) - datumX;
                    }else{
                        return datumX - (cX * (RV.NowProject.blockSize / 2));
                    }
                }
            }
        }
        return 0;
    };

    /**
     * 获得当前形象的判定区域
     * @param x 预selfX，或selfX 缺省 selfX
     * @param y 预selfY，或selfY 缺省 selfY
     * @param vw 判定宽度 缺省 validWidth
     * @param vh 判定高度 缺省 validHeight
     * @returns {IRect} 矩形区域
     */
     this.getCharactersRect = function(x,y,vw,vh){
         if(x == null) x = selfX;
         if(y == null) y = selfY;
         if(vw == null) vw = validWidth;
         if(vh == null) vh = validHeight;

         var xx = x + ( RV.NowProject.blockSize - vw) / 2 + validX;
         var yy = y + RV.NowProject.blockSize - vh + validY;
        validRect.left = xx;
        validRect.top = yy;
        validRect.right = xx + vw;
        validRect.bottom = yy + vh;
        return validRect;
    };

    /**
     * 获得碰撞矩形
     * @param rect
     * @returns {*}
     */
    this.isContactFortRect = function(rect){
        var rect1 = _sf.getCharactersRect();
        eventRect.left = rect1.left ;
        eventRect.right = rect1.right;
        eventRect.top = rect1.top;
        eventRect.bottom = rect1.bottom ;
        return eventRect.intersects(rect);
    };


    /**
     * 获得坐标单位的ShowX、ShowY
     * @returns {*[]}
     */
    this.getShowPoint = function(){
        return [showX,showY];
    };

    /**
     * 判断交互块类型
     * @param rect 判定矩形
     * @returns array[];
     */
    this.isHaveInteractionBlock = function(rect){
        if(blocks == null) return null;
        tempList.length = 0;
        for(var i = 0;i<blocks.length;i++){
            if(blocks[i].getData().isItem == false &&
                Math.abs(blocks[i].x - selfX) < validWidth * 2 &&  Math.abs(blocks[i].y - selfY) < validHeight * 2
                && blocks[i].isCollision(rect)){
                tempList.push(blocks[i]);
            }
        }
        return tempList;
    };

    /**
     * 与拥有实体的触发器进行碰撞
     * @param rect
     * @returns array[];
     */
    this.collisionTrigger = function(rect){
        var events = RV.NowMap.getEvents();
        tempList.length = 0;
        for(var i = 0 ; i < events.length ; i++){
            var char = events[i].getCharacter();
            if(char != null){
                var chars = char.getCharacter();
                if(events[i].entity && chars !== this &&
                    Math.abs(chars.x - selfX) < validWidth * 2 &&  Math.abs(chars.y - selfY) < validHeight * 2
                    && rect.intersects( events[i].getRect() )){
                    tempList.push(events[i].getRect());
                }
            }
        }
        return tempList;
    };

    /**
     * 与拥有实体的敌人进行碰撞
     * @param rect
     * @returns array[];
     */
    this.collisionEnemy = function(rect){
        var enemy = RV.NowMap.getEnemys();
        tempList.length = 0;
        for(var i = 0;i<enemy.length;i++){
            if(enemy[i].visible && !enemy[i].isDie && enemy[i].entity && enemy[i].getActor().getCharacter() !== this &&
                Math.abs(enemy[i].getActor().getCharacter().x - selfX) < validWidth * 2 &&
                Math.abs(enemy[i].getActor().getCharacter().y - selfY) < validHeight * 2
                && rect.intersects(enemy[i].getRect()) ){
                tempList.push(enemy[i].getRect());
            }
        }
        return tempList;
    };


    /**
     * 获得交互块
     * @returns {*}
     */
    this.getInteractionBlocks = function(){
        return blocks;
    };

    /**
     * 更改行走图图片
     * @param rActor
     */
    this.changeImage = function(rActor){
        data = rActor;
        cofs = [];

        for(var i = 0;i<data.actionList.length;i++){
            if(data.actionList[i][0].length > 0){
                var animation = data.actionList[i][0][0];
                cofs[i] = new IBCof(RF.LoadCache("Characters/" + data.file + data.actionName[i]) , animation.x,animation.y,animation.width,animation.height);
            }else{
                cofs[i] = null;
            }
        }

        if(cofs[0] != null){
            nowAction = data.actionList[0][dir];
            nowCof = cofs[0];
            //离地高度计算
            difHeight = nowAction[0].height / 2;
            validWidth = Math.max(Math.floor(nowAction[0].width / RV.NowProject.blockSize),1) * RV.NowProject.blockSize;
            validHeight = RV.NowProject.blockSize / 2;

            if(sprite != null){
                sprite.setBCof(cofs[0]);
            }else{
                sprite = new ISprite(cofs[0],view);
            }

            sprite.z =z;
            //动画帧相关
            animationWait = nowAction[0].time;
            animationIndex = -1;
        }
        resetShowXY();

    };

    this.correctShowPosition = function(){
        CorrectedPosition(showX,showY);
    };

    this.getCenterPoint = function(){
        if(nowCof == null) return [0,0];
        var index = animationIndex;
        if(index < 0) index = 0;
        return [showX,(sprite.y - nowAction[index].dy) + sprite.height];
    };
    //==================================== 私有函数 ===================================
    /**
     * 中心点坐标寻找
     * @return array
     */
    function centerPoint( w,  h,  x,  y) {
        var ax = x - (w / 2);
        var ay = y - (h / 2);
        return [ax,ay];
    }
    /**
     * 坐标修正
     * @param x 待修正X
     * @param y 待修正Y
     */
    function CorrectedPosition(x , y ){
        var rect = _sf.getCharactersRect();
        var tempx = Math.round(rect.left / RV.NowProject.blockSize) ;
        var tempy =  Math.round((rect.bottom - 32) / (RV.NowProject.blockSize / 2));
        if(sprite != null){
            var index = animationIndex;
            if(index < 0) index = 0;
            var p = centerPoint(nowCof.width , nowCof.height,x,y);
            sprite.x = p[0] + nowAction[index].dx;
            sprite.y = p[1] + nowAction[index].dy;
            if(_sf.autoZ){
                sprite.z = 100 + 15 * (tempy) + tempx + 3 ;
            }else if(_sf.topZ){
                sprite.z = 13000;
            }else{
                sprite.z = 90;
            }
        }
        if(selfBlock != null){
            selfBlock.zoomX = 20;
            selfBlock.zoomY = 20;
            selfBlock.x = _sf.x;
            selfBlock.y = _sf.y;
        }
    }

    /**
     * 重置显示坐标
     */
    function resetShowXY(){
        showX = selfX + ( RV.NowProject.blockSize / 2);
        //showY = (selfY - difHeight) + RV.NowProject.blockSize;
        showY = (selfY - difHeight) + RV.NowProject.blockSize;
    }

}/**
 * Created by 七夕小雨 on 2018/7/19.
 * 文字选项逻辑
 */
function LChoice(){
    var _sf = this;
    //最后选的选项索引
    this.index = -1;
    //是否结束
    this.isW = false;
    //选项精灵集合
    this.bList = [];
    //结束回调
    this.end = null;

    //选项图片资源
    var bitmapM,bitmapB;
    //是否关闭
    var isClose;

    var data = RV.NowUI.uis[RV.NowSet.setAll.MsgIfid];
    if(data == null){
        throw "Text divergence is not set 文本分歧界面未设置"
    }

    var checkData = data.findData("chooseGroup");
    if(checkData == null){
        throw "缺少 Key 为 chooseGroup的控件"
    }

    var textData = checkData.checks[0].text;

    var files = checkData.getFiles();

    bitmapM = RF.LoadBitmap(files[1]);
    bitmapB = RF.LoadBitmap(files[0]);

    var nowIndex = 0;
    var tempIndex = -1;
    /**
     * 加载文字选项
     * @param list 文字内容数组
     * @param z z图层
     */
    this.setupChoice = function(list,z) {

        _sf.dispose();

        if(list == null || list.length <= 0) return;
        var index = 0;
        var ww = 0;
        var hh = 0;
        for (var i = 0; i < list.length; i++) {
            var choice = RF.MakerValueText(list[i]);
            var temp = RF.TextAnalysisNull(choice);
            var bt = new IButton(bitmapB,bitmapM," ",null,false);
            var w = IFont.getWidth(temp, textData.fontSize);
            var h = IFont.getHeight(temp, textData.fontSize);
            var tx = 0;
            var ty = 0;

            if(textData.HAlign == 0){
                tx = textData.x;
            }else if(textData.HAlign == 1){
                tx = (bitmapB.width - w) / 2 + textData.x;
            }else{
                tx = (bitmapB.width - w) + textData.x;
            }

            if(textData.VAlign == 0){
                ty = textData.y;
            }else if(textData.HAlign == 1){
                ty = (bitmapB.height - h) / 2 + textData.y;
            }else{
                ty = (bitmapB.height - h) + textData.y;
            }
            bt.getBack().angle = checkData.angle;
            bt.getText().angle = checkData.angle;
            bt.zoomX = checkData.zoomX / 100;
            bt.zoomY = checkData.zoomY/ 100;
            bt.opacity =checkData.opacity / 255;
            bt.drawTitle(textData.fontColor.TColor() + "\\s[" + textData.fontSize + "]" + choice , tx , ty );
            bt.z = data.level + checkData.level;
            bt.x = i * checkData.dx;
            bt.y = i * checkData.dy;
            bt.setOpactiy(0);
            bt.fadeTo(1,20);
            if(bt.x + bt.width > ww){
                ww = bt.x + bt.width;
            }
            if(bt.y + bt.height > hh){
                hh = bt.y + bt.height;
            }
            _sf.bList.push(bt);
        }
        var endX = 0;
        var endY = 0;
        if(checkData.HAlign == 0){
            endX = checkData.x;
        }else if(checkData.HAlign == 1){
            endX = (RV.NowProject.gameWidth - ww) / 2 + checkData.x;
        }else{
            endX = (RV.NowProject.gameWidth - ww) + checkData.x;
        }
        if(checkData.VAlign == 0){
            endY = checkData.y;
        }else if(checkData.VAlign == 1){
            endY = (RV.NowProject.gameHeight - hh) / 2 + checkData.y;
        }else{
            endY = (RV.NowProject.gameHeight - hh) + checkData.y;
        }
        for(i = 0;i<_sf.bList.length;i++){
            _sf.bList[i].x += endX;
            _sf.bList[i].y += endY;
        }
        _sf.index = -1;
        this.isW = true;
        isClose = false;
        nowIndex = 0;
        updateIndex();
    };

    function updateIndex(){
        if(nowIndex == tempIndex) return;
        tempIndex = nowIndex;
        for (var i = 0; i < _sf.bList.length; i++) {
            if(nowIndex == i){
                _sf.bList[i].setBitmap(bitmapM,bitmapB,false);
            }else{
                _sf.bList[i].setBitmap(bitmapB,bitmapM,false);
            }
        }
    }

    /**
     * 主循环
     */
    this.update = function(){
        if(!this.isW) return;
        //鼠标控制
        for (var i = 0; i < this.bList.length; i++) {
            var bt = this.bList[i];
            if(bt == null ) continue;
            if(bt.isClick()){
                _sf.index = i;
                _sf.closeChoice();
                if(_sf.end != null){
                    _sf.end(_sf.index);
                }
                return;
            }
            if(bt.getBack().isSelectTouch() == 1){
                nowIndex = i;
                updateIndex()
            }
        }
        //键盘控制
        if(IInput.isKeyDown(RC.Key.down) || IInput.isKeyDown(40)){//下
            nowIndex += 1;
            if(nowIndex >= this.bList.length) nowIndex = 0;
            updateIndex();
        }
        if(IInput.isKeyDown(RC.Key.up) || IInput.isKeyDown(38)){//上
            nowIndex -= 1;
            if(nowIndex < 0) nowIndex = this.bList.length - 1;
            updateIndex();
        }
        if(IInput.isKeyDown(RC.Key.ok) || IInput.isKeyDown(32) || IInput.isKeyDown(108) || IInput(13)){
            _sf.index = nowIndex;
            _sf.closeChoice();
            if(_sf.end != null){
                _sf.end(_sf.index);
            }
        }

    };
    /**
     * 关闭选项
     */
    this.closeChoice = function(){
        for (var i = 0; i < this.bList.length; i++) {
            var bt = this.bList[i];
            if(bt == null ) continue;
            bt.fadeTo(0,10);
        }
        _sf.isW = false;
        isClose = true;
    };

    /**
     * 释放
     */
    this.dispose = function(){
        if(_sf.bList != null){
            for (var i = 0; i < this.bList.length; i++) {
                var bt = this.bList[i];
                if(bt == null ) continue;
                bt.disposeMin();
            }
            _sf.bList = [];
        }

    };



}/**
 * Created by 七夕小雨 on 2019/1/9.
 * 饰品逻辑处理部分
 * @param resDecorate 饰品资源
 * @param viewport 承载视窗
 * @param maxWidth 地图最大宽度
 * @param maxHeight 地图最大高度
 * @param x 初始X坐标
 * @param y y坐标
 * @param z z图层
 * @constructor
 */
function LDecorate(resDecorate,viewport,maxWidth,maxHeight,x,y,z){
    var data = resDecorate;
    //显示移动效果
    var moveType = data.type;//0无效果 1呼吸 2左右 3右左 4下上 5上下
    var moveSpeed = data.time;
    var moveDif = 0;
    var moveWait = 0;
    var moveNowWaite = 0;
    //移动速率计算
    if(moveSpeed <= 10){
        moveDif = 11 - moveSpeed;
        moveWait = 0;
    }else{
        moveDif = 1;
        moveWait = 10 - moveSpeed;
    }

    //动画帧相关
    var animWait = data.anim[0].time;
    var animIndex = 0;
    //生成绘制精灵
    var cof = new IBCof(RF.LoadCache("Decorate/" + data.file) , data.anim[0].x, data.anim[0].y, data.anim[0].width, data.anim[0].height);
    var sprite = new ISprite(cof , viewport);
    sprite.z = z;
    //计算起始X，Y坐标
    var tx = x * RV.NowProject.blockSize;
    tx = tx - (data.anim[0].width - RV.NowProject.blockSize) / 2;
    var ty = (y + 1) * RV.NowProject.blockSize;
    ty = ty - data.anim[0].height;
    sprite.x = tx;
    sprite.y = ty;

    //呼吸效果直接使用addAction
    if(moveType == 1){
        sprite.addAction(action.fade,1,0,moveSpeed);
        sprite.addAction(action.wait,moveSpeed);
        sprite.addAction(action.fade,0,1,moveSpeed);
        sprite.actionLoop = true;
    }

    //刷新
    this.update = function(){
        //动画刷新
        if(data.anim.length > 1){
            if(animWait == 0){
                animIndex += 1;
                if(animIndex >=  data.anim.length){
                    animIndex = 0;
                }
                var tempR = data.anim[animIndex];
                cof.x = tempR.x;
                cof.y = tempR.y;
                cof.width = tempR.width;
                cof.height = tempR.height;
                animWait = tempR.time;
            }else{
                animWait -= 1;
            }
        }

        //显示效果刷新
        if(moveNowWaite == 0){
            if(moveType == 2){ //左右移动
                sprite.x += moveDif;
                if(sprite.x >= maxWidth){
                    sprite.x = 0 - sprite.width;
                }
            }else if(moveType == 3){//右左移动
                sprite.x -= moveDif;
                if(sprite.x <= 0 - sprite.width){
                    sprite.x = maxWidth;
                }
            }else if(moveType == 4){//下上移动
                sprite.y -= moveDif;
                if(sprite.y <= 0 - sprite.height){
                    sprite.y = maxHeight;
                }
            }else if(moveType == 5){//上下移动
                sprite.y += moveDif;
                if(sprite.y >= maxHeight){
                    sprite.y = 0 - sprite.height;
                }
            }
        }else{
            moveNowWaite -= 1;
        }

    };

    //释放
    this.dispose = function(){
        sprite.disposeMin();
    };

}/**
 * Created by 七夕小雨 on 2019/3/16.
 * 敌人逻辑处理
 * @param enemy 敌人配置数据
 * @param view 敌人承载视窗
 * @param mdata 地图基础图块
 * @param blocks 交互块
 * @param mapdata 地图数据
 */
function LEnemy(enemy , view , mdata , blocks , mapdata){

    var _sf = this;

    var data = enemy;
    var cof = RV.NowSet.findEnemyId(enemy.eid);

    //设定敌人相关基础属性
    this.hp = cof.maxHp;
    this.mp = cof.maxMp;
    this.entity = cof.isEntity;
    this.sumHp = 0;
    this.visible = data.isVisible;
    this.activity = data.isActivity;

    //敌人AI每次行动冷却节奏时间
    var isInjured = false;
    var actionWait = 0;
    var skilling = false;
    var hpBar = new IScrollbar(RF.LoadCache("System/bar-enemy-hp_0.png") , RF.LoadCache("System/bar-enemy-hp_1.png") , 0,cof.maxHp , view);
    hpBar.z = 9999;
    hpBar.visible = false;

    //设定Actor相关属性
    var char = new LActor(view , 0 , 0 , mdata , blocks , data.x * RV.NowProject.blockSize, data.y * RV.NowProject.blockSize, cof.picId , cof.isPenetrate ? 240 : 180);
    char.camp = 1;
    if(cof.moveTarget == 0){
        char.getCharacter().fixedOrientation = true;
        char.getCharacter().autoZ = cof.moveType != 0;
    }
    char.IsCanPenetrate = cof.isPenetrate;
    char.getCharacter().CanPenetrate = cof.isPenetrate;
    char.baseSpeed = 1 + ((cof.moveSpeed - 1) * 0.5);
    char.atkType = cof.atkType - 1;
    char.bulletId = cof.atkBullet;
    char.atkDis = cof.atkDistance;
    char.atkWait = cof.atkTime;
    char.getCharacter().setDir(enemy.dir);

    //死亡回调
    char.DieDo = function(){
        hpBar.visible = false;
        _sf.isDie = true;
        var anim = RV.NowRes.findResAnim(cof.dieAnimId);
        if(anim != null){
            RV.NowCanvas.playAnim(cof.dieAnimId,function(){
                settlement();
            },char,true);
        }else{
            settlement();
        }
        for(var i = 0;i<_sf.buff.length;i++){
            _sf.buff[i].dispose();
        }
    };

    //受伤回调
    char.InjuredDo = function(type,num){
        if(_sf.visible == false ) return;
        var tempHp = 0;
        var tempShow = 0;
        if(type == 0){//固定值伤害
            tempHp = num;
        }else if(type == 1){//百分比伤害
            tempHp = cof.maxHp * num;
        }else if(type == 2){//我方角色过来的伤害
            //伤害运算
            var obj = num;
            if(obj == null) return;
            if(obj.crit && obj.damage > 0){
                tempShow = 1;
            }

            if(!char.superArmor){
                if(cof.moveTarget != 0){
                    //击退
                    if(obj.dir == 0){
                        char.getCharacter().y += obj.repel;
                    }else if(obj.dir == 1){
                        char.getCharacter().x -= obj.repel;
                    }else if(obj.dir == 2){
                        char.getCharacter().x += obj.repel;
                    }else if(obj.dir == 3){
                        char.getCharacter().y -= obj.repel;
                    }else if(obj.dir == 4){
                        char.getCharacter().x -= obj.repel / 1.4;
                        char.getCharacter().y += obj.repel / 1.4;
                    }else if(obj.dir == 5){
                        char.getCharacter().x += obj.repel / 1.4;
                        char.getCharacter().y += obj.repel / 1.4;
                    }else if(obj.dir == 6){
                        char.getCharacter().x -= obj.repel / 1.4;
                        char.getCharacter().y -= obj.repel / 1.4;
                    }else if(obj.dir == 7){
                        char.getCharacter().x += obj.repel / 1.4;
                        char.getCharacter().y -= obj.repel / 1.4;
                    }
                }
            }
            tempHp = obj.damage;
            //角色吸血
            RV.GameData.actor.hp += parseInt(tempHp * (RV.GameData.actor.getbloodSucking() / 100));

        }

        if(tempHp > 0){
            char.stiff(10);
            _sf.sumHp += tempHp;
            isInjured = true;
            if(char.nowSkill != null){
                if(char.nowSkill.stopSkill()){
                    char.nowSkill.update();
                    char.nowSkill = null;
                }
            }
        }
        new LNum(tempShow,tempHp,view,char.getCharacter().x,char.getCharacter().y);
        _sf.hp -= tempHp;
        hpBar.visible = true;
        hpBar.setValue(_sf.hp,cof.maxHp);
        hpBar.update();
        if(_sf.hp <= 0){
            char.deathDo();
        }
    };
    //当前正在处理的动作
    var nowAction = null;

    //敌人在地图中的编号
    this.index = enemy.index;
    //buff集合
    this.buff = [];
    //敌人是否死亡
    this.isDie = false;

    //行动限制部分
    this.LAtk = false;
    this.LSkill = false;
    this.LItem = false;
    this.LMove = false;
    this.LSquat = false;
    this.LJump = false;
    this.LOutOfCombat = false;

    //筛选并行条件
    var tempAction = cof.action.concat();
    var judgeList = [];
    while(true){
        if(tempAction.length <= 0){
            break;
        }
        var temp = tempAction[0];
        var isAdd = false;
        for(var j = 0;j<judgeList.length;j++){
            if(judgeList[j][0].rate == temp.rate && judgeList[j][0].nextTime == temp.nextTime && judgeList[j][0].actionType == temp.actionType &&
                ( (judgeList[j][0].actionType == 0 && judgeList[j][0].actionId == temp.actionId) ||
                (judgeList[j][0].actionType == 1 && judgeList[j][0].skillId == temp.skillId) )){
                judgeList[j].push(temp);
                isAdd = true;
                break;
            }
        }
        if(isAdd == false){
            judgeList.push([temp]);
        }
        tempAction.splice(0,1);

    }

    /**
     * 死亡后添加物品与经验
     */
    function settlement(){
        var trigger = RV.NowSet.findEventId(cof.evetId);
        if(trigger != null){
            trigger.doEvent();
        }
        RV.GameData.actor.exp += cof.exp;
        RV.GameData.money += cof.money;
        var items = [];
        //准备获得物品
        for(var i = 0;i<cof.items.length;i++){
            if(RF.ProbabilityHit(cof.items[i].rate / 100)){
                var item = new DBagItem(cof.items[i].type,cof.items[i].id);
                if(item.findData() != null){
                    items.push(item);
                }
            }
        }
        for(i = 0;i<items.length;i++){
            RV.GameData.addItem(items[i].type,items[i].id,1);
            var itemCof = items[i].findData();
            var icon = new ISprite(RF.LoadCache("Icon/" + itemCof.icon),view);
            icon.opacity = 0;
            icon.x = char.getCharacter().x;
            icon.y = char.getCharacter().y;
            icon.z = 500;
            icon.addAction(action.wait,20 * i);
            icon.addAction(action.move,icon.x,icon.y - 60,60);
            icon.addAction(action.fade,1,0,60);
            icon.setOnEndFade(function(sp){
                sp.disposeMin();
            });
        }
    }

    /**
     * 主刷新
     */
    this.update = function(){
        if(char == null) return;
        if(!_sf.isDie){
            char.getCharacter().getSpirte().visible = this.visible;
        }
        if(char.getCharacter().getSpirte().visible && char.getCharacter().getSpirte().opacity > 0 ) char.update();
        if(this.activity == false || this.visible == false || this.isDie) return;
        updateAction();
        updateBar();
        _sf.updateBuff();
        if(_sf.mp < 0) _sf.mp = 0;
        if(_sf.mp > _sf.getMaxMp()) _sf.mp = cof.getMaxMp();
        if(_sf.hp > _sf.getMaxHP()) _sf.hp = _sf.getMaxHP();
    };

    /**
     * 释放
     */
    this.dispose = function(){
        char.dispose();
        hpBar.disposeMin();
        for(var i = 0;i<_sf.buff.length;i++){
            _sf.buff[i].dispose();
        }
        char = null;
    };

    this.updateGravityNum = function(){
        if(char == null) return;
        char.GravityNum = (RV.GameData.gravityNum / 100) * mapdata.gravity;
        char.Speed[0] = 0;
    };


    /**
     * 获得朝向
     * @returns {number}
     */
    this.getDir = function(){
        return char.getDir();
    };

    /**
     * 获得LActor对象
     * @returns {LActor}
     */
    this.getActor = function(){
        return char;
    };

    /**
     * 获得最大HP
     * @returns {*}
     */
    this.getMaxHP = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().maxHP;
        }
        return cof.maxHp + buffAdd;
    };

    /**
     * 获得最大MP
     */
    this.getMaxMp = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().maxMP;
        }
        return cof.maxMp + buffAdd;
    };

    /**
     * 获得物理攻击
     * @returns {*}
     */
    this.getWAtk = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().watk;
        }
        return cof.WAtk + buffAdd;
    };

    /**
     * 获得物理防御
     * @returns {*}
     */
    this.getWDef = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().wdef;
        }
        return cof.WDef + buffAdd;
    };

    /**
     * 获得魔法攻击
     * @returns {*}
     */
    this.getMAtk = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().matk;
        }
        return cof.MAtk + buffAdd;
    };

    /**
     * 获得魔法防御
     * @returns {*}
     */
    this.getMDef = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().mdef;
        }
        return cof.MDef + buffAdd;
    };

    /**
     * 获得速度
     * @returns {*}
     */
    this.getSpeed = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().speed;
        }
        return cof.Speed + buffAdd;
    };

    /**
     * 获得幸运
     * @returns {*}
     */
    this.getLuck = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().luck;
        }
        return cof.Luck + buffAdd;
    };

    /**
     * 获得暴击率
     * @returns {number}
     */
    this.getAddCrit = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().crit;
        }
        return buffAdd;
    };

    /**
     * 获得暴击强度
     * @returns {number}
     */
    this.getAddCritF = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().critF;
        }
        return buffAdd;
    };

    /**
     * 获得闪避
     * @returns {number}
     */
    this.getAddDodge = function(){
        var buffAdd = 0;
        for(var i = 0;i<_sf.buff.length;i++){
            buffAdd += _sf.buff[i].getData().dodge;
        }
        return buffAdd
    };

    /**
     * 获得击退距离
     */
    this.getRepel = function(){
        return cof.atkRepel;
    };
    /**
     * 获得敌人配置数据
     * @returns {DSetEnemy}
     */
    this.getData = function(){
        return cof;
    };
    /**
     * 获得判定矩形
     * @returns {IRect}
     */
    this.getRect = function(){
        return char.getCharacter().getCharactersRect();
    };

    this.getSpriteRect = function(){
        return char.getCharacter().getSpirte().GetRect();
    };

    this.getCharacter = function(){
        return char.getCharacter();
    };

    /**
     * 附加BUFF
     * @param id buffID
     */
    this.addBuff = function(id){
        if(_sf.isDie) return;
        var buffCof = RV.NowSet.findStateId(id);
        if(buffCof != null){
            var canAdd = true;
            if(!buffCof.cantResist && cof.defState[id] != null){
                canAdd = !RF.ProbabilityHit(cof.defState[id] / 100);
            }
            if(canAdd){
                var bf = new DBuff(buffCof,_sf);
                bf.endDo = function(){
                    _sf.buff.remove(bf);
                };
                _sf.buff.push(bf);
                //buff变化
                for(var mid in buffCof.cState){
                    if(buffCof.cState[mid] === 1){
                        _sf.addBuff(mid);
                    }else if(buffCof.cState[mid] === 2){
                        _sf.subBuff(mid);
                    }
                }
            }

        }
    };

    this.getUserRect = function(){
        return char.getUserRect();
    };

    /**
     * 解除BUFF
     * @param id buffID
     */
    this.subBuff = function(id){
        for(var i = _sf.buff.length - 1;i>=0;i--){
            if(_sf.buff[i].getData().id === id){
                _sf.buff[i].endDo = null;
                _sf.buff[i].overBuff();
                _sf.buff.remove(_sf.buff[i]);
            }
        }
    };

    /**
     * 刷新buff
     */
    this.updateBuff = function(){
        for(var i = 0;i<_sf.buff.length;i++){
            _sf.buff[i].update();
        }
    };
    /**
     * 寻找BUFF
     * @param id buffID
     * @returns {*}
     */
    this.findBuff = function(id){
        for(var i = 0;i < _sf.buff.length;i++){
            if(_sf.buff[i].getData().id === id){
                return _sf.buff[i];
            }
        }
        return null;
    };
    /**
     * 存档
     * @returns {{x, y, hp: *, mp: (*|number), visible: (boolean|*), activity: (boolean|*), isDie: (boolean|*)}}
     */
    this.save = function(){
        return {
            x:char.getCharacter().x,
            y:char.getCharacter().y,
            hp : _sf.hp,
            mp : _sf.mp,
            visible : _sf.visible,
            activity : _sf.activity,
            isDie:_sf.isDie,
            camp:char.camp
        }
    };

    /**
     * 读档
     * @param info
     */
    this.load = function(info){
        char.getCharacter().x = info.x;
        char.getCharacter().y = info.y;
        char.camp = info.camp;
        _sf.hp = info.hp;
        _sf.mp = info.mp;
        _sf.visible = info.visible;
        _sf.activity = info.activity;
        _sf.isDie = info.isDie;
        if(_sf.isDie){
            char.isDie = _sf.isDie;
            char.getCharacter().getSpirte().opacity = 0;
        }else{
            hpBar.visible = _sf.hp < cof.maxHp;
            hpBar.setValue(_sf.hp,cof.maxHp);
        }
    };

    /**
     * 获得敌人属性
     * @returns {{def: number, atk: number}}
     */
    this.getAttribute = function(actor){
        var obj1 = null;
        var obj2 = null;
        if(actor == null){
            obj1 = RV.GameData.actor.getDefAttrbute(cof.attributeId);
            obj2 = RV.GameData.actor.getDefAttrbute(cof.otherAttributeId);
        }else{
            obj1 = actor.getDefAttrbute(cof.attributeId);
            obj2 = actor.getDefAttrbute(cof.otherAttributeId);
        }
        return {
            atk : obj1.atk + Math.abs(obj2.atk / 2),
            def : obj1.def + Math.abs(obj2.def / 2)
        }
    };

    this.getDefAttrbute = function(id){
        var eatt = RV.NowSet.findAttributeId(id);
        if(eatt == null) return {atk:1,def:0};
        var self1 = RV.NowSet.findAttributeId(cof.attributeId);
        if(self1 == null) return {atk:1,def:0};
        var self2 = RV.NowSet.findAttributeId(cof.otherAttributeId);
        if(self2 == null) return self1.getNum(eatt);
        var obj1 = self1.getNum(eatt);
        var obj2 = self2.getNum(eatt);
        return {
            atk : obj1.atk + Math.abs(obj2.atk / 2),
            def : obj1.def + Math.abs(obj2.def / 2)
        }
    };

    /**
     * 刷新血条
     */
    function updateBar(){
        var sp = char.getCharacter().getSpirte();
        hpBar.x = sp.x + (sp.width - hpBar.width) / 2;
        hpBar.y = sp.y - hpBar.height - 2;
        hpBar.update();
    }

    /**
     * 刷新动作
     */
    function updateAction(){
        if(actionWait > 0){
            actionWait -= 1;
            return;
        }
        if(nowAction == null && !char.atking() && char.stiffTime <= 0 && !char.actionStart && !char.isDie && !skilling){
            if(cof.action.length < 0) return;
            nowAction = ActionSelect();
            if(nowAction != null){
                ActionDo(nowAction);
                nowAction = null;
            }
        }
    }

    /**
     * 敌人动作处理
     * @param action 动作
     * @constructor
     */
    function ActionDo(action){
        if(action.actionType === 0){//基础动作
            var events = [];
            var et = new DEvent(null);
            if(action.actionId === 0){//什么也不做
                et.code = 201;
                et.args = [action.nextTime + ""];
            }else if(action.actionId === 1){//攻击
                if(!_sf.LAtk) char.atk(_sf);
                et.code = 201;
                et.args = [cof.atkTime + ""];
                actionWait = cof.atkTime;
            }else if(action.actionId === 2 && !_sf.LMove){//撤退

                var enemys = RV.NowMap.getEnemys();
                var tempEnemy = RV.NowMap.getActor();
                var dis = 99999999;
                if(char.camp == 1){//敌人远离角色与友军
                    tempEnemy = RV.NowMap.getActor();
                    dis = Math.abs( Math.sqrt( Math.pow((char.getCharacter().x - RV.NowMap.getActor().getUserRect().centerX),2) +
                        Math.pow((char.getCharacter().y - RV.NowMap.getActor().getUserRect().centerY),2) ) );
                    for(var i = 0;i<enemys.length;i++){
                        if(enemys[i] == _sf){
                            continue;
                        }
                        //怪物在范围内
                        if(enemys[i].getActor().camp == 2 &&!enemys[i].isDie && enemys[i].visible){
                            var tempRect = enemys[i].getActor().getUserRect();
                            //计算两点间距离
                            var tempDis = Math.abs( Math.sqrt( Math.pow((char.getCharacter().x - tempRect.centerX),2) + Math.pow((char.getCharacter().y - tempRect.centerY),2) ) );
                            if(tempDis < dis){
                                dis = tempDis;
                                tempEnemy = RV.NowMap.getEnemys()[i];
                            }
                        }
                    }

                }else if(char.camp == 2){//友军远离敌人
                    for(i = 0;i<enemys.length;i++){
                        if(enemys[i] == _sf){
                            continue;
                        }
                        //怪物在范围内
                        if(enemys[i].getActor().camp == 1 &&!enemys[i].isDie && enemys[i].visible){
                            tempRect = enemys[i].getActor().getUserRect();
                            //计算两点间距离
                            tempDis = Math.abs( Math.sqrt( Math.pow((char.getCharacter().x - tempRect.centerX),2) + Math.pow((char.getCharacter().y - tempRect.centerY),2) ) );
                            if(tempDis < dis){
                                dis = tempDis;
                                tempEnemy = RV.NowMap.getEnemys()[i];
                            }
                        }
                    }
                }
                if(tempEnemy != null){
                    moveToActor(tempEnemy);
                }

                //et.code = 4101;
                //et.args = ["7","1","0"];
            }else if(action.actionId === 3 && !_sf.LMove){//移动
                if(cof.moveTarget === 1){//目标角色
                    et.code = 4101;
                    et.args = ["5","1","0"];
                }else if(cof.moveTarget === 2 && !_sf.LMove){//目标巡逻
                    if(isTurnTo(char.getCharacter().getCharactersRect(),char.getDir()) || char.getCharacter().CannotMoveX || char.getCharacter().CannotMoveY){
                        dir = char.getDir();
                        if(dir == 0){
                            char.moveUp();
                        }else if(dir == 1){
                            char.moveRight();
                        }else if(dir == 2){
                            char.moveLeft();
                        }else if(dir == 3){
                            char.moveDown();
                        }else if(dir == 4){
                            char.moveRightUp();
                        }else if(dir == 5){
                            char.moveLeftUp();
                        }else if(dir == 6){
                            char.moveRightDown();
                        }else if(dir == 6){
                            char.moveLeftDown();
                        }
                    }
                    et.code = 4101;
                    et.args = ["6",(RV.NowProject.blockSize / 2) + "","1"];
                }else if(cof.moveTarget === 3 && !_sf.LMove){//随机移动
                    et.code = 4101;
                    et.args = ["4","1","0"];
                }else if(cof.moveTarget === 4 && !_sf.LMove){//前进
                    et.code = 4101;
                    et.args = ["6","1","0"];
                }

            }else if(action.actionId === 4 && !_sf.LMove){//跳跃
                et.code = 4102;
                if(char.getDir() == 0){
                    et.args = ["1","-1","0"];
                }else if(char.getDir() == 1){
                    et.args = ["-1","-1","0"];
                }

            }else if(action.actionId === 5 ){//转向
                char.getCharacter().fixedOrientation = false;
                var dir = char.getDir();
                if(dir == 0){
                    char.moveUp();
                }else if(dir == 1){
                    char.moveRight();
                }else if(dir == 2){
                    char.moveLeft();
                }else if(dir == 3){
                    char.moveDown();
                }else if(dir == 4){
                    char.moveRightUp();
                }else if(dir == 5){
                    char.moveLeftUp();
                }else if(dir == 6){
                    char.moveRightDown();
                }else if(dir == 6){
                    char.moveLeftDown();
                }
            }else if(action.actionId === 6){
                char.getCharacter().fixedOrientation = false;
                faceToActor(RV.NowMap.getActor());
            }else if(action.actionId === 7 && !_sf.LAtk){
                char.getCharacter().fixedOrientation = false;
                faceToActor(RV.NowMap.getActor());
                char.atk(_sf);
                et.code = 201;
                et.args = [cof.atkTime + ""];
                actionWait = cof.atkTime;
            }else if(action.actionId == 8 && char.camp == 2){
                dis = 999999;
                enemys = RV.NowMap.getEnemys();
                tempEnemy = null;
                for(i = 0;i<enemys.length;i++){
                    if(enemys[i] == _sf){
                        continue;
                    }
                    tempRect = enemys[i].getActor().getUserRect();
                    //怪物在范围内
                    if(enemys[i].getActor().camp == 1 &&!enemys[i].isDie && enemys[i].visible){
                        //计算两点间距离
                        tempDis = Math.abs( Math.sqrt( Math.pow((char.getCharacter().x - tempRect.centerX),2) + Math.pow((char.getCharacter().y - tempRect.centerY),2) ) );
                        if(tempDis < dis){
                            dis = tempDis;
                            tempEnemy = RV.NowMap.getEnemys()[i];
                        }

                    }
                }
                if(tempEnemy != null){
                    faceToActor(tempEnemy);
                }
            }else if(action.actionId == 9 && char.camp == 2 && !_sf.LAtk){
                dis = 999999;
                enemys = RV.NowMap.getEnemys();
                tempEnemy = null;
                for(i = 0;i<enemys.length;i++){
                    if(enemys[i] == _sf){
                        continue;
                    }
                    tempRect = enemys[i].getActor().getUserRect();
                    //怪物在范围内
                    if(enemys[i].getActor().camp == 1 &&!enemys[i].isDie && enemys[i].visible){
                        //计算两点间距离
                        tempDis = Math.abs( Math.sqrt( Math.pow((char.getCharacter().x - tempRect.centerX),2) + Math.pow((char.getCharacter().y - tempRect.centerY),2) ) );
                        if(tempDis < dis){
                            dis = tempDis;
                            tempEnemy = RV.NowMap.getEnemys()[i];
                        }
                    }
                }
                if(tempEnemy != null){
                    faceToActor(tempEnemy);
                }
                char.atk(_sf);
                et.code = 201;
                et.args = [cof.atkTime + ""];
                actionWait = cof.atkTime;
            }
            if(et.code > 0){
                events.push(et);
                char.setAction(events,true,false);
            }

        }else if(action.actionType === 1){//释放技能
            skilling = true;
            RV.NowCanvas.playSkill(char , action.skillId , _sf,function(){
                skilling = false;
                et = new DEvent(null);
                et.code = 201;
                et.args = [action.nextTime + ""];
                events = [];
                events.push(et);
                char.setAction(events,true,false);
            });

        }

    }

    function moveToActor(actor){
        var dx = char.getCharacter().x - actor.getCharacter().x;
        var dy = char.getCharacter().y - actor.getCharacter().y;
        if(Math.abs(dx) > Math.abs(dy)){
            if(dx > 0){
                char.moveRight();
            }else{
                char.moveLeft();
            }
        }else{
            if(dy > 0){
                char.moveDown();
            }else{
                char.moveUp();
            }
        }
    }

    function faceToActor(actor){
        var dx = char.getCharacter().x - actor.getCharacter().x;
        var dy = char.getCharacter().y - actor.getCharacter().y;
        if(Math.abs(dx) > Math.abs(dy)){
            if(dx > 0){
                char.getCharacter().setDir(1);
            }else{
                char.getCharacter().setDir(2);
            }
        }else{
            if(dy > 0){
                char.getCharacter().setDir(3);
            }else{
                char.getCharacter().setDir(0);
            }
        }
    }

    /**
     * 是否碰触墙壁
     * @param rect 当前判定区域
     * @param dir 方向
     * @returns {boolean}
     */
    function isTurnTo(rect,dir){
        var current = RV.NowMap.getMapCurrent();
        var xx = 0;
        var yy = 0;
        if(dir == 0){
            xx = parseInt(rect.centerX / (RV.NowProject.blockSize / 2));
            yy = parseInt(rect.bottom / (RV.NowProject.blockSize / 2)) + 1;
        }else if(dir == 1){
            xx = parseInt(rect.left / (RV.NowProject.blockSize / 2)) - 1;
            yy = parseInt(rect.centerY / (RV.NowProject.blockSize / 2));
        }else if(dir == 2){
            xx = parseInt(rect.right / (RV.NowProject.blockSize / 2)) + 1;
            yy = parseInt(rect.centerY / (RV.NowProject.blockSize / 2));
        }else if(dir == 3){
            xx = parseInt(rect.centerX / (RV.NowProject.blockSize / 2));
            yy = parseInt(rect.top / (RV.NowProject.blockSize / 2)) - 1;
        }else if(dir == 4){
            xx = parseInt(rect.left / (RV.NowProject.blockSize / 2)) - 1;
            yy = parseInt(rect.bottom / (RV.NowProject.blockSize / 2)) + 1;
        }else if(dir == 5){
            xx = parseInt(rect.right / (RV.NowProject.blockSize / 2)) + 1;
            yy = parseInt(rect.bottom / (RV.NowProject.blockSize / 2)) + 1;
        }else if(dir == 6){
            xx -= 1;
            yy = parseInt(rect.top / (RV.NowProject.blockSize / 2)) - 1;
        }else if(dir == 7){
            xx = parseInt(rect.right / (RV.NowProject.blockSize / 2)) + 1;
            yy = parseInt(rect.top / (RV.NowProject.blockSize / 2)) - 1;
        }
        return current[xx] == null || current[xx][yy] == null || current[xx][yy];
    }

    function isInRect(type,userRect){
        var enemy = RV.NowMap.getEnemys();
        if(char.camp == 1){//敌军判定友军和操作角色
            if(type == 0){//在敌方攻击范围内
                if(RV.NowMap.getActor().getAtkRect().intersects(char.getCharacter().getCharactersRect())){
                    return true;
                }
                for(var i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 2 && enemy[i].visible && !enemy[i].isDie && enemy[i].getActor().getAtkRect().intersects( char.getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }
            }else if(type == 1){//在我方攻击范围内
                if(char.getAtkRect().intersects(RV.NowMap.getActor().getCharacter().getCharactersRect())){
                    return true;
                }
                for(i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 2 && enemy[i].visible  && !enemy[i].isDie && char.getAtkRect().intersects( enemy[i].getActor().getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }

            }else if(type == 2){
                if(userRect.intersects(RV.NowMap.getActor().getCharacter().getCharactersRect())){
                    return true;
                }
                for(i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 2 && enemy[i].visible  && !enemy[i].isDie && userRect.intersects( enemy[i].getActor().getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }
            }
        }else if(char.camp == 2){//友军判定敌人
            if(type == 0){
                for(i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 1 && enemy[i].visible && !enemy[i].isDie && enemy[i].getActor().getAtkRect().intersects( char.getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }
            }else if(type == 1){
                for(i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 1 && enemy[i].visible && !enemy[i].isDie && char.getAtkRect().intersects( enemy[i].getActor().getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }
            }else if(type == 2){
                for(i = 0; i < enemy.length ; i++){
                    if(enemy[i].getActor().camp == 1 && enemy[i].visible  && !enemy[i].isDie && userRect.intersects( enemy[i].getActor().getCharacter().getCharactersRect()  ) ){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 敌人行为选择
     * @returns {*}
     */
    function ActionSelect(){
        var canList = [];
        var maxRand = 0;
        //添加达到条件的指令
        for(var i = 0;i<judgeList.length;i++){
            var count = 0;
            for(var j = 0;j<judgeList[i].length;j++){
                if(judgeAction(judgeList[i][j])){
                    count += 1;
                }
            }
            if(count >= judgeList[i].length){
                char.reAction = true;
                canList.push(judgeList[i][0]);
                maxRand += judgeList[i][0].rate;
            }

        }
        if(canList.length <= 0) return null;
        //选择指令
        while(true){
            var now = RF.RandomChoose(canList);
            if(RF.ProbabilityHit(now.rate / maxRand)){
                return now;
            }
        }

    }

    function judgeAction(action){

        var x = char.getCharacter().x;
        var y = char.getCharacter().y;
        if(action.IfType === 0){
            return true
        }
        if(action.IfType === 1 ){
            if(action.IfNum2 == 0 && (_sf.hp <= cof.maxHp * (action.IfNum1 / 100))){
                return true
            }else if(action.IfNum2 != 0 && (_sf.hp >= cof.maxHp * (action.IfNum1 / 100))){
                return true;
            }
        }
        if(action.IfType === 2){
            if(action.IfNum2 == 0 && RV.GameData.actor.level <= action.IfNum2){
                return true;
            }else if(action.IfNum2 == 0 && RV.GameData.actor.level >= action.IfNum2){
                return true;
            }
        }
        if(action.IfType === 3 && RV.GameData.getValue(action.IfNum3,false)){
            return true;
        }
        if(action.IfType === 4 && isInRect(0,null)){
            return true;
        }
        if(action.IfType === 5 && isInRect(1,null)){
            return true;
        }
        if(action.IfType === 6){
            var userRect = new IRect(1,1,1,1);
            var dir = char.getDir();
            if(dir == 0 || dir == 4 || dir == 5){
                userRect.x = x + action.triggerY *RV.NowProject.blockSize;
                userRect.y = y + action.triggerX * RV.NowProject.blockSize;
                userRect.width = action.triggerHeight * RV.NowProject.blockSize;
                userRect.height = action.triggerWidth * RV.NowProject.blockSize;
            }else if(dir == 1){
                userRect.x = x - ((action.triggerX + action.triggerWidth - 1) *RV.NowProject.blockSize);
                userRect.y = y + action.triggerY * RV.NowProject.blockSize;
                userRect.width = action.triggerWidth * RV.NowProject.blockSize;
                userRect.height = action.triggerHeight * RV.NowProject.blockSize;
            }else if(dir == 2){
                userRect.x = x + action.triggerX * RV.NowProject.blockSize;
                userRect.y = y + action.triggerY * RV.NowProject.blockSize;
                userRect.width = action.triggerWidth * RV.NowProject.blockSize;
                userRect.height = action.triggerHeight * RV.NowProject.blockSize;
            }else if(dir == 3 || dir == 6 || dir == 7){
                userRect.x = x - ((action.triggerY + action.triggerHeight - 1) *RV.NowProject.blockSize);
                userRect.y = y - ((action.triggerX + action.triggerWidth - 1) *RV.NowProject.blockSize);
                userRect.width = action.triggerHeight * RV.NowProject.blockSize;
                userRect.height = action.triggerWidth * RV.NowProject.blockSize;
            }
            if(isInRect(2,userRect)){
                return true
            }

        }
        if(action.IfType === 8){//遇到障碍物
            var mx = Math.round(x / RV.NowProject.blockSize);
            var my = Math.round(y / RV.NowProject.blockSize);
            if(isTurnTo(mx,my,char.getDir()) || char.getCharacter().CannotMoveX){
                return true;
            }
        }
        if(action.IfType === 9 && isInjured){//被攻击时
            isInjured = false;
            return true;
        }
    }




}/**
 * Created by 七夕小雨 on 2019/1/9.
 *  交互块运行逻辑
 * @param interactionBlock 交互块配置数据
 * @param bd  交互块地图数据
 * @param view 交互块承载视窗
 * @param x x坐标
 * @param y y坐标
 * @param z z图层
 * @param mdata 基础图块数据
 * @param blocks 其他交互块数据
 * @param mapdata 地图数据
 * @param mark 指定mark
 */
function LInteractionBlock(interactionBlock , bd , view , x , y , z , mdata , blocks,mapdata,mark){

    var _sf = this;

    var mapData = mdata;
    var data = interactionBlock;
    var blockData = bd;
    var resBlock = RV.NowRes.findResBlock(data.BlockId);

    var block = new LBlock(resBlock,blockData,view,x,y,data.isPenetrate ? 175 : z);

    var isEat = false;
    var doEnd = false;

    var nowPage = null;

    var pageIndex = -1;
    var tempPageIndex = -1;

    //是否被破坏
    this.isDestroy = false;
    //移动速度
    this.speed = [0,0];

    //是否可以X方向移动
    this.CannotMoveX = false;
    //是否可以Y方向移动
    this.CannotMoveY = false;
    //重力
    this.isGravity = data.isGravity;
    //穿透
    this.isPenetrate = data.isPenetrate;
    if(mark != null){
        this.mark = mark;
    }else{
        this.mark = x + "," + y;
    }

    //外部控制相关变量移动
    this.actionStart = false;
    this.actionLock = false;

    var baseSpeed = 2;
    //移动相关
    var actionIgnore = false;
    var actionLoop = false;
    var actionMove = false;
    var actionList = [];
    var actionPos = -1;
    var nowAction = null;
    var actionWait = 0;
    var moveDir = -1;
    var moveDis = 0;


    var oldGravity = false;
    var oldSpeed = false;


    /**
     * 设置Y
     */
    Object.defineProperty(this, "y", {
        get: function () {
            return block.getSprite().y;
        },
        set: function (value) {
            _sf.CannotMoveY = true;
            var dir = -1;
            var sp = block.getSprite();
            if(value > sp.y) dir = 2; //下
            if(value < sp.y) dir = 3; //上
            var rect = null;
            var dy = 0;
            if(dir == 2){
                rect = new IRect(sp.x,value,sp.x + RV.NowProject.blockSize,value + RV.NowProject.blockSize);
                dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.bottom,false,rect);
                _sf.CannotMoveY = dy != 0;
                sp.y = value - dy;
            }else if(dir == 3){
                rect = new IRect(sp.x,value,sp.x + RV.NowProject.blockSize,value + RV.NowProject.blockSize);
                dy = _sf.isCanMoveUpDown(rect.left,rect.right,rect.top,true,rect);
                _sf.CannotMoveY = dy != 0;
                sp.y = value + dy;
            }
        }
    });

    /**
     * 设置X
     */
    Object.defineProperty(this, "x", {
        get: function () {
            return block.getSprite().x;
        },
        set: function (value) {
            _sf.CannotMoveX = true;
            var dir = -1;
            var sp = block.getSprite();
            if(value < sp.x) dir = 0;//左
            if(value > sp.x) dir = 1;//右
            var rect = null;
            var dx = 0;
            if(dir == 0){
                rect = new IRect(value,sp.y,value + RV.NowProject.blockSize,sp.y + RV.NowProject.blockSize);
                dx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.left,true,rect);
                _sf.CannotMoveX = dx != 0;
                sp.x = value + dx;
            }else if(dir == 1){
                rect = new IRect(value,sp.y,value + RV.NowProject.blockSize,sp.y + RV.NowProject.blockSize);
                dx = _sf.isCanMoveLeftRight(rect.top , rect.bottom,rect.right,false,rect);
                _sf.CannotMoveX = dx != 0;
                sp.x = value - dx;
            }


        }
    });

    /**
     * 获得数据
     * @returns {*}
     */
    this.getData = function(){
        return data;
    };
    /**
     * 主循环
     */
    this.update = function(){
        block.update();
        updateAction();
        updateEvent();
        if(data.isItem){
            if(!isEat && RV.NowMap.getActor().getCharacter().isContactFortRect(block.getRect())){
                eat();
            }
        }
        if(this.isGravity){
            this.speed[0] += (RV.GameData.gravityNum / 100) * mapdata.gravity;
            var sp = block.getSprite();
            this.y += this.speed[0];
        }
        if(this.CannotMoveX){
            _sf.speed[1] = 0;
        }
        if(this.CannotMoveY){
            _sf.speed[0] = 0;
        }
    };

    /**
     * 消失块处理
     */
    this.disappear = function(){
        var sp = block.getSprite();
        if(sp.isAnim()) return;
        sp.addAction(action.fade,1.0,0.5,20);
        sp.addAction(action.wait,20);
        sp.addAction(action.fade,0.5,1,20);
        sp.addAction(action.wait,20);
        sp.addAction(action.fade,1.0,0.5,20);
        sp.addAction(action.wait,20);
        sp.addAction(action.fade,0.5,1,20);
        sp.addAction(action.wait,20);
        sp.addAction(action.fade,1.0,0.0,30);
        sp.addAction(action.wait,300);
        sp.addAction(action.fade,0.0,1,20);
        sp.addAction(action.wait,20);
    };

    /**
     * 是否与矩形碰撞到
     * @param rect
     * @returns {boolean|*}
     */
    this.isCollision = function(rect){
        if(rect == null || this.isPenetrate){
            return false;
        }
        if(block.getSprite() != null && (block.getSprite().opacity <= 0 || !block.getSprite().visible)) return false;
        return rect.intersects(block.getRect());
    };

    /**
     * 执行触发器
     * @param type 执行类型
     */
    this.doEvent = function(type){
        if(nowPage != null && nowPage.type == type && !doEnd){
            if(nowPage.isParallel && RF.FindOtherEvent(_sf) == null ){
                RF.AddOtherEvent(nowPage.events , _sf , _sf.mark);
                doEnd = !nowPage.loop;
            }else if(!nowPage.isParallel && RV.InterpreterMain.isEnd){
                RV.InterpreterMain.addEvents(nowPage.events);
                RV.InterpreterMain.NowEventId = -1;
                doEnd = !nowPage.loop;
            }
        }
    };


    /**
     * 获得交互块触发器
     * @returns DTrigger
     */
    this.getTrigger = function(){
        return blockData.trigger;
    };

    /**
     * 处理交互块上的触发器
     */
    function updateEvent(){
        if(blockData.trigger == null || block.getSprite() != null && (block.getSprite().opacity <= 0 || !block.getSprite().visible)) return;
        var trigger = blockData.trigger;
        for(var i = trigger.page.length - 1;i >= 0;i--) {
            if(trigger.page[i].logic.tag == null){
                trigger.page[i].logic.tag = _sf;
            }
            if(i != tempPageIndex && trigger.page[i].logic.result()){
                pageIndex = i;
                tempPageIndex = pageIndex;
                nowPage = trigger.page[i];
                doEnd = false;
                return;
            }
            if(i == tempPageIndex && trigger.page[i].logic.result()){
                return;
            }
        }
        nowPage = null;
        doEnd = false;
    }

    /**
     * 吃掉物品
     */
    function eat(){
        if(!data.isItem && isEat) return;
        isEat = true;
        if(data.isStatus){
            var rblock = RV.NowRes.findResBlock(data.BlockId2);
            if(rblock != null){
                block.changeBitmap(rblock);
            }else{
                block.getSprite().visible = false;
            }
        }else{
            block.getSprite().visible = false;
        }
        RV.GameData.money += data.money;
        if(data.hpValue != 0){
            RV.NowMap.getActor().injure(0 , -data.hpValue);
        }
        if(data.mpValue != 0){
            RV.NowMap.getActor().injure( 4 ,-data.mpValue);
        }
        RV.GameData.actor.addPow.maxHp += data.maxHpValue;
        RV.GameData.actor.addPow.maxMp += data.maxMpValue;
        RV.GameData.life += data.leftValue;
        RV.GameData.actor.addBuff();

        for(var id in data.cState){
            if(data.cState[id] == 1){
                RV.GameData.actor.addBuff(id);
            }else if(data.cState[id] == 2){
                RV.GameData.actor.subBuff(id);
            }
        }

        _sf.doEvent(6);


        RV.NowCanvas.playAnim(data.animId,null,_sf,true);
        RV.NowCanvas.playAnim(data.actorAnimId,null,RV.NowMap.getActor(),true);

        var trigger = RV.NowSet.findEventId(data.EventId);
        if(trigger != null){
            trigger.doEvent();
        }

    }

    /**
     * 破坏交互块
     */
    this.destroy = function(){
        this.isDestroy = true;
        //播放破坏动画
        RV.NowCanvas.playAnim(data.animId,null,this,true);
        RV.NowCanvas.playAnim(data.actorAnimId,null,RV.NowMap.getActor(),true);

        //如果有破坏形态，切换破坏形态，如果没有则消失
        if(data.isStatus){
            var rblock = RV.NowRes.findResBlock(data.BlockId2);
            if(rblock != null){
                block.changeBitmap(rblock);
            }else{
                block.getSprite().visible = false;
            }
        }else{
            block.getSprite().visible = false;
        }
        //如果还有内部块则抛处内部块
        if(blockData.inBlock != null){
            var sbi = RV.NowSet.findBlockId(blockData.inBlock.id);
            var minX = parseInt(Math.round(_sf.x / RV.NowProject.blockSize));
            var minY = parseInt(Math.round(_sf.y / RV.NowProject.blockSize));
            var lb = new LInteractionBlock(sbi,blockData.inBlock ,view , minX  , data.isStatus ? minY - 1 : minY , z , mdata , blocks,mapdata , "in"+_sf.mark );
            lb.update();
            if(lb.isGravity){
                lb.speed[0] = -5;
            }
            blocks.push(lb);
        }
        //执行绑定触发器
        _sf.doEvent(4);
        //执行破坏通用触发器
        var trigger = RV.NowSet.findEventId(data.EventId);
        if(trigger != null){
            trigger.doEvent();
        }
    };

    /**
     * 释放
     */
    this.dispose = function(){
        block.dispose();
    };

    /**
     * 获得矩形
     * @returns {*}
     */
    this.getRect = function(){
        return block.getRect();
    };

    /**
     * 向上下移动的判定
     * @param startX 起始X判定
     * @param endX 终点X判定
     * @param datumY 基准Y
     * @param isUp 是否是上方向
     * @param rect 判定矩形
     * @returns {number} 偏差值
     */
    this.isCanMoveUpDown = function(startX,endX,datumY,isUp,rect) {
        if (_sf.CanPenetrate) {
            return 0;
        }
        var bY = parseInt(datumY / RV.NowProject.blockSize);
        var bX1 = parseInt((startX + 1) / RV.NowProject.blockSize);
        var bX2 = parseInt((endX - 1) / RV.NowProject.blockSize);

        var cY = parseInt(datumY / (RV.NowProject.blockSize / 2));
        var cX1 = parseInt(((startX + 1) / (RV.NowProject.blockSize / 2)));
        var cX2 = parseInt(((endX - 1) / (RV.NowProject.blockSize / 2)));


        if (rect != null) {

            var newRect = new IRect(rect.left + 1, rect.top + 1, rect.right - 1, rect.bottom);

            var tempInteractionBlock = isHaveInteractionBlock(newRect);
            if (tempInteractionBlock != null) {
                _sf.InteractionBlockContact = tempInteractionBlock;
                if (!isUp) {
                    _sf.InteractionBlockBelow = tempInteractionBlock;
                }
                if (isUp) {
                    return tempInteractionBlock.getRect().bottom - datumY;
                } else {
                    return datumY - tempInteractionBlock.getRect().top;
                }
            }
        }
        var current = RV.NowMap.getData().current;
        for(var i = cX1; i <= cX2 ; i++){
            if(current[i][cY]){
                if(isUp){
                    return ((cY + 1) *(RV.NowProject.blockSize / 2)) - datumY
                }else{
                    return datumY - (cY * (RV.NowProject.blockSize / 2));
                }
            }
        }
        return 0;


    };

    /**
     * 向左右移动的判定
     * @param startY 起始Y
     * @param endY 终点Y
     * @param datumX 基准X
     * @param isLeft 是否是左方向
     * @param rect 判定矩形
     * @returns {number} 偏差值
     */
    this.isCanMoveLeftRight = function(startY,endY,datumX,isLeft,rect){
        if(_sf.CanPenetrate) { return  0; }
        _sf.IsInSand = false;
        _sf.isSandDie = false;
        var bX = parseInt(datumX / RV.NowProject.blockSize);
        var bY1 = parseInt((startY + 1) / RV.NowProject.blockSize);
        var bY2 = parseInt((endY - 1) / RV.NowProject.blockSize);

        var cX = parseInt(  datumX / (RV.NowProject.blockSize / 2));
        var cY1 = parseInt((startY + 1) / (RV.NowProject.blockSize / 2));
        var cY2 = parseInt((endY - 1) / (RV.NowProject.blockSize / 2));
        //判定左右移动是否出框
        if(isLeft && datumX <= 0){
            return  datumX * -1;
        }else if(!isLeft && datumX >= mapData.length * RV.NowProject.blockSize){
            return datumX - mapData.length * RV.NowProject.blockSize;
        }

        if(bY1 > 0 && mapData[bX][bY1 - 1] >= 3000 && mapData[bX][bY1] >= 3000){
            _sf.isSandDie = true;
        }
        if(rect != null){
            var newRect = new IRect(rect.left + 1,rect.top + 1,rect.right - 1,rect.bottom - 1);

            var tempInteractionBlock = isHaveInteractionBlock(newRect);
            if(tempInteractionBlock != null){
                _sf.InteractionBlockContact = tempInteractionBlock;
                if(isLeft ){
                    return tempInteractionBlock.getRect().right - datumX;
                }else{
                    return datumX - tempInteractionBlock.getRect().left;
                }
            }
        }


        var current = RV.NowMap.getData().current;
        for(var i = cY1; i <= cY2 ; i++){
            if(current[cX][i]){
                if(isLeft){
                    return ((cX + 1) * (RV.NowProject.blockSize / 2)) - datumX;
                }else{
                    return datumX - (cX * (RV.NowProject.blockSize / 2));
                }
            }
        }
        return 0;
    };

    /**
     * 设置动作列表
     * @param action 动作列表
     * @param isIgnore 忽略不可移动动作
     * @param isLoop 循环移动
     */
    this.setAction = function(action,isIgnore,isLoop){
        if(this.actionStart) return;
        actionLoop = isLoop;
        actionIgnore = isIgnore;
        for(var i = 0;i<action.length;i++){
            actionList.push(action[i]);
        }
        if(actionList.length > 0){
            this.actionStart = true;
        }
        oldSpeed = baseSpeed;
        oldGravity = _sf.isGravity;
    };

    /**
     * 处理动作列表
     */
    function updateAction(){
        if(!_sf.actionStart || actionList.length <= 0) return;
        if(actionWait > 0){
            actionWait -= 1;
            return;
        }
        if(actionMove){
            if(moveDir == 0){
                if(moveDis <= _sf.y){
                    _sf.y -= baseSpeed;
                }else{
                    actionMove = false;
                }
                return;
            }else if(moveDir == 1){
                if(moveDis >= _sf.y){
                    _sf.y += baseSpeed;
                }else{
                    actionMove = false;
                }
                return;
            }else if(moveDir == 2){
                if(moveDis <= _sf.x){
                    _sf.x -= baseSpeed;
                }else{
                    actionMove = false;
                }
                return;
            }else if(moveDir == 3){
                if(moveDis >= _sf.x){
                    _sf.x += baseSpeed;
                }else{
                    actionMove = false;
                }
                return;
            }
            if(actionIgnore && (_sf.CannotMoveX || _sf.CannotMoveY)){
                actionMove = false;
            }
            //刷新移动
            return;
        }


        actionPos += 1;
        if(actionPos > actionList.length - 1){
            if(actionLoop){
                actionPos = 0;
            }else{
                _sf.isGravity = oldGravity;
                baseSpeed = oldSpeed;
                actionPos = -1;
                actionList = [];
                _sf.actionStart = false;
                return;
            }
        }
        nowAction = actionList[actionPos];
        if(nowAction.code == 4101){//移动
            moveDir = parseInt(nowAction.args[0]);
            if(moveDir == 4){
                moveDir = rand(0,3);
            }else if(moveDir == 5){
                var actor = RV.NowMap.getActor().getCharacter();
                var tempD1 = Math.abs(_sf.x - actor.x);
                var tempD2 = Math.abs(_sf.y - actor.y);
                if(tempD1 > tempD2){
                    if(_sf.x > actor.x){
                        moveDir = 2;
                    }else{
                        moveDir = 3;
                    }
                }else{
                    if(_sf.y > actor.y){
                        moveDir = 0;
                    }else{
                        moveDir = 1;
                    }
                }
            }else if(moveDir == 6){
                if(_sf.getDir() == 0){
                    moveDir = 3;
                }else{
                    moveDir = 2;
                }
            }else if(moveDir == 7){
                if(_sf.getDir() == 0){
                    moveDir = 2;
                }else{
                    moveDir = 3;
                }
            }
            if(nowAction.args[2] == "0"){
                moveDis = parseInt(nowAction.args[1]) * RV.NowProject.blockSize;
            }else {
                moveDis = parseInt(nowAction.args[1]);
            }
            if(moveDir == 0){//上移动
                moveDis = _sf.y - moveDis;
            }else if(moveDir == 1){//下
                moveDis = _sf.y + moveDis;
            }else if(moveDir == 2){//左
                moveDis = _sf.x - moveDis;
            }else if(moveDir == 3){//右
                moveDis = _sf.x + moveDis;
            }
            actionMove = true;
        }else if(nowAction.code == 4104){//更改速度
            baseSpeed = parseInt(nowAction.args[0]);
        }else if(nowAction.code == 4118){//更改形象
            var res = RV.NowRes.findResBlock(parseInt(nowAction.args[0]));
            if(res != null){
                block.changeBitmap(res);
            }
        }else if(nowAction.code == 4108){//更改不透明度
            block.getSprite().opacity = parseInt(nowAction.args[0]) / 255;
        }else if(nowAction.code == 4114){//穿透ON
            _sf.isPenetrate  = true;
        }else if(nowAction.code == 4115){//穿透OFF
            _sf.isPenetrate = false;
        }else if(nowAction.code == 201){//等待
            actionWait = parseInt(nowAction.args[0]);
        }else if(nowAction.code == 503){//音效
            RV.GameSet.playSE("Audio/" + nowAction.args[0],parseInt(nowAction.args[1]));
        }
    }

    /**
     * 判断交互块类型
     * @param rect 判定矩形
     * @returns {LInteractionBlock} 交互块对象
     */
    function isHaveInteractionBlock(rect){
        if(blocks == null) return null;
        for(var i = 0;i<blocks.length;i++){
            if(blocks[i] != _sf && blocks[i].getData().isItem == false && blocks[i].isCollision(rect)){
                return blocks[i];
            }
        }
        return null;
    }

    /**
     * 获得展示矩形
     * @returns {*}
     */
    this.getShowRect = function(){
        return block.getSprite().GetRect();
    };
    /**
     * 获得精灵矩形
     * @returns {*}
     */
    this.getUserRect = function(){
        return block.getSprite().GetRect();
    };
    /**
     * 获得方块朝向
     * @returns {number}
     */
    this.getDir = function(){
        return 0;
    };

    this.getSprite = function(){
        return block.getSprite();
    };

    this.save = function(){
        return {
            x:_sf.x,
            y:_sf.y,
            isEat : isEat,
            isDestroy : _sf.isDestroy,
            isGravity : _sf.isGravity,
            isPenetrate:_sf.isPenetrate,
            opacity:block.getSprite().opacity
        }
    };

    this.load = function(info){
        _sf.x = info.x;
        _sf.y = info.y;
        isEat = info.isEat;
        _sf.isDestroy = info.isDestroy;
        _sf.isGravity = info.isGravity;
        _sf.isPenetrate = info.isPenetrate;
        block.getSprite().opacity = info.opacity;
        if(isEat){
            block.getSprite().visible = false;
        }
        if(_sf.isDestroy){
            if(data.isStatus){
                var rblock = RV.NowRes.findResBlock(data.BlockId2);
                if(rblock != null){
                    block.changeBitmap(rblock);
                }else{
                    block.getSprite().visible = false;
                }
            }else{
                block.getSprite().visible = false;
            }
        }

    };

    this.setSwitch = function(index,sw){
        if(RV.GameData.selfSwitch[RV.NowMap.id] == null){
            RV.GameData.selfSwitch[RV.NowMap.id] = [];
        }
        if(RV.GameData.selfSwitch[RV.NowMap.id][_sf.mark] == null){
            RV.GameData.selfSwitch[RV.NowMap.id][_sf.mark] = [false,false,false,false,false,false,false,false,false];
        }
        RV.GameData.selfSwitch[RV.NowMap.id][_sf.mark][index] = sw;
    };

    this.getSwitch = function(index){
        if(RV.GameData.selfSwitch[RV.NowMap.id] == null){
            return false;
        }
        if(RV.GameData.selfSwitch[RV.NowMap.id][_sf.mark] == null){
            return false;
        }
        return RV.GameData.selfSwitch[RV.NowMap.id][_sf.mark][index];
    }

}/**
 * Created by 七夕小雨 on 2019/1/8.
 * 地图处理逻辑
 * @param id 地图ID
 * @param func 回调函数
 * @param x 初始化角色x坐标
 * @param y 初始化橘色y坐标
 */
function LMap(id,func,x,y){

    var _sf = this;
    this.id = id;
    //当前地图全局化
    RV.NowMap = this;
    //切换地图回调
    this.changeMap = null;

    //获得到地图数据
    var data = RV.NowProject.findMap(id);
    var scene = RV.NowRes.findResMap(data.backgroundId);
    //计算地图尺寸
    var width = data.width * RV.NowProject.blockSize;
    var height = data.height * RV.NowProject.blockSize;
    //生成地图视窗
    var view = new IViewport(0 , 0 , RV.NowProject.gameWidth , RV.NowProject.gameHeight);
    view.z = 10;

    var actor = null;//操作的角色
    //双远景
    var back1 = null;
    var back2 = null;
    //基础图块数据
    var mapData = [];
    // 震动使用
    var ShakePower,ShakeSpeed,ShakeDuration,ShakeDirection,Shake;
    var oldVpX,oldVpY;
    var StartShake;
    //视窗移动所需
    this.viewMove = false;
    this.viewSpeed = 0;
    this.viewDis = 0;
    this.viewDir = 0;
    //绘制敌人
    this.drawEnemys = function(enemy,camp){
        var e = new LEnemy(enemy , view , mapData , interactionBlock,data);
        if(camp != null){
            e.getActor().camp = camp;
        }
        enemys.push(e);
    };
    //震动初始化
    shakeInit();
    //初始化地图背景
    if(scene.background1.file != "" && scene.background1.file != null){
        back1 = new ISprite(RF.LoadBitmap("Scene/" + scene.background1.file));
        back1.tiling = scene.background1.type == 0;
        if(back1.tiling){
            back1.RWidth = width;
            back1.RHeight = height;
        }
        back1.z = 1;
    }

    if(scene.background2.file != "" && scene.background2.file != null){
        back2 = new ISprite(RF.LoadBitmap("Scene/" + scene.background2.file),view);
        back2.tiling = scene.background2.type == 0;
        if(back2.tiling){
            back2.RWidth = width;
            back2.RHeight = height;
        }
        back2.z = 2;
    }

    //静态处理在这里
    var mapSprite = new Array(6);
    var mapAuto = [];
    //动态
    var block = [];
    var interactionBlock = [];
    var enemys = [];
    var trigger = [];

    var isInit = false;

    //读取地图图片资源
    function loadRes(func){
        var nowIndex = 0;
        var maxIndex = 0;

        maxIndex += scene.blocks.length;
        maxIndex += scene.titles.length;

        for(var i = 0;i<scene.blocks.length;i++){
            var rb = RV.NowRes.findResBlock(scene.blocks[i].id) ;
            RF.LoadCache("Block/" + rb.file,function(){
                nowIndex += 1;
                if(nowIndex >= maxIndex){
                    func();
                }
            },null);
        }

        for(i = 0;i < scene.titles.length ; i++) {
            RF.LoadCache("Tilesets/" + scene.titles[i].file, function () {
                nowIndex += 1;
                if (nowIndex >= maxIndex) {
                    func();
                }
            }, null)
        }

        if(maxIndex <= 0){
            func();
        }

    }


    /**
     * 初始化地图
     * @param x 要移动的x坐标
     * @param y 要移动的y坐标
     * @param isNewActor
     */
    function init(x,y,isNewActor){
        mapData = [];
        //对应图层的z坐标
        var zA = [10,20,30,10000,11000,12000];
        //生成5张大精灵，分别对应场景精灵
        for(var i = 0; i < 6; i++){
            mapSprite[i] = new ISprite(IBitmap.CBitmap(width,height),view);
            mapSprite[i].z = zA[i];
        }
        //开始绘制图块
        for(i = 0 ; i < data.width ; i++){
            mapData[i] = [];
            for(var j = 0 ; j < data.height ; j++){
                mapData[i][j] = -9976;
                //地面层
                if(data.level1[0][i][j] != null){
                    drawBlock(mapSprite[0],block,i,j,data.level1[0][i][j],zA[0],false);
                }
                if(data.level1[1][i][j] != null){
                    drawBlock(mapSprite[1],block,i,j,data.level1[1][i][j],zA[1],false);
                }
                if(data.level1[2][i][j] != null){
                    drawBlock(mapSprite[2],block,i,j,data.level1[2][i][j],zA[2],false);
                }
                //自然层
                for(var k = 0;k<3;k++){
                    if(data.level2[k][i][j] != null) drawBlock(null,block,i,j,data.level2[k][i][j],k,true);
                }

                //覆盖层
                if(data.level3[0][i][j] != null){
                    drawBlock(mapSprite[3],block,i,j,data.level3[0][i][j],zA[3],false);
                }
                if(data.level3[1][i][j] != null){
                    drawBlock(mapSprite[4],block,i,j,data.level3[1][i][j],zA[4],false);
                }
                if(data.level3[2][i][j] != null){
                    drawBlock(mapSprite[5],block,i,j,data.level3[2][i][j],zA[5] ,false);
                }
            }

        }

        //将角色放进对应位置
        if(isNewActor || actor == null){
            actor = new LActor(view,width,height,mapData,interactionBlock,x * RV.NowProject.blockSize,y * RV.NowProject.blockSize,
                RV.NowSet.findActorId(RV.GameData.actor.getActorId()).actorId,200 );
        }else{

            var oldP = actor.getCharacter().CanPenetrate;
            actor.getCharacter().CanPenetrate = true;
            actor.setInitData(width,height,mapData,interactionBlock);
            actor.getCharacter().x = x * RV.NowProject.blockSize;
            actor.getCharacter().y = y * RV.NowProject.blockSize;
            actor.getCharacter().CanPenetrate = oldP;
        }
        actor.IsCanPenetrate = RV.GameData.isCanPenetrate;
        actor.isLook = true;
        actor.atkDis = RV.GameData.actor.getAtkDis();
        actor.bulletId = RV.GameData.actor.getBulletAnimId();
        actor.atkType = RV.GameData.actor.getSetData().attackType;
        actor.getCharacter().setDir(RV.GameData.dir);
        actor.camp = 0;
        actor.lookActor();
        actor.getCharacter().isActor = true;
        //绘制敌人
        for(i = 0 ; i < data.enemys.length ; i++){
            _sf.drawEnemys(data.enemys[i]);
        }
        //绘制触发器
        for(i = 0 ; i < data.trigger.length;i++){
            trigger.push(new LTrigger(data.trigger[i],view , mapData , interactionBlock,data));
        }

        //播放地图音乐
        data.bgm.play(0);
        data.bgs.play(1);
        _sf.viewMove = data.autoMove;
        _sf.viewSpeed = data.autoMoveSpeed;
        _sf.viewDir = data.autoDir;

        if(RV.GameData.getMapData() != null){
            _sf.loadMap(RV.GameData.getMapData());
            RV.GameData.clearMapData();
        }
    }


    /**
     * 绘制图块
     * @param mapSp 地图承载精灵
     * @param blocks 图块集合
     * @param x x坐标
     * @param y y坐标
     * @param block 图块数据
     * @param z z图层
     * @param isAuto 是否是自然层
     */
    function drawBlock(mapSp,blocks,x,y,block,z,isAuto){
        var rbb = null;
        var oldz = z;
        if(isAuto){
            z = 100 + 30 * y + x + z;
        }
        //自动原件
        if(block.type == -2){
            if(block.id < scene.blocks.length){
                rbb = RV.NowRes.findResBlock(scene.blocks[block.id].id);
                if(rbb != null){
                    if(scene.blocks[block.id].type == 4){
                        if(rbb.drawType == 0){
                            setBaseBlockType(x,y,scene.blocks[block.id],rbb);
                        }else if(rbb.drawType == 1 && (block.drawIndex == 20 || block.drawIndex == 21 || block.drawIndex == 22 ||
                            block.drawIndex == 23 || block.drawIndex == 33 || block.drawIndex == 34 || block.drawIndex == 35 ||
                            block.drawIndex == 36 || block.drawIndex == 37 || block.drawIndex == 42 || block.drawIndex == 43 ||
                            block.drawIndex == 45 || block.drawIndex == 46 || block.drawIndex == 47)){
                            setBaseBlockType(x,y,scene.blocks[block.id],rbb);
                        }else if(rbb.drawType == 2 && (block.drawIndex == 0 || block.drawIndex == 1 || block.drawIndex == 2)){
                            setBaseBlockType(x,y,scene.blocks[block.id],rbb);
                        }
                    }else{
                        setBaseBlockType(x,y,scene.blocks[block.id],rbb);
                    }
                }


            }
        }else if(block.type == -1){//交互块
            var sbi = RV.NowSet.findBlockId(block.id);
            interactionBlock.push(new LInteractionBlock(sbi,block ,view,x,y, z ,mapData , interactionBlock,data));
            return;
        }else{//图块
            if(block.type < scene.titles.length){
                cof = new IBCof(RF.LoadCache("Tilesets/" + scene.titles[block.type].file),
                    block.x * RV.NowProject.blockSize, block.y * RV.NowProject.blockSize,
                    block.width * RV.NowProject.blockSize, block.height * RV.NowProject.blockSize);
                if(isAuto){
                    var sp = new ISprite(cof,view);
                    sp.z = 100 + 30 * (y + (block.height - 1)) + x + oldz;
                    sp.x = x * RV.NowProject.blockSize;
                    sp.y = y * RV.NowProject.blockSize;
                    mapAuto.push(sp);
                }else{
                    mapSp.drawBitmapBCof(x * RV.NowProject.blockSize,y* RV.NowProject.blockSize,cof,false);
                }

            }

        }

        if(rbb != null){
            var r = null;
            var tx = 0;
            var ty = 0;
            var cof = null;
            var tempx = 0;
            var tempy = 0;
            if(rbb.anim.length == 1){
                r = rbb.anim[0].getRect();
                if(rbb.drawType == 0){
                    cof = new IBCof(RF.LoadCache("Block/" + rbb.file), r.left, r.top, r.width, r.height);
                }else if(rbb.drawType == 1){
                    tempx = block.drawIndex % 8;
                    tempy = parseInt(block.drawIndex / 8);
                    cof = new IBCof(RF.LoadCache("Block/" + rbb.file), r.left + tempx * RV.NowProject.blockSize,
                        r.top + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
                }else if(rbb.drawType == 2){
                    tempx = block.drawIndex % 3;
                    tempy = parseInt(block.drawIndex / 3);
                    cof = new IBCof(RF.LoadCache("Block/" + rbb.file), r.left + tempx * RV.NowProject.blockSize,
                        r.top + tempy * RV.NowProject.blockSize, RV.NowProject.blockSize, RV.NowProject.blockSize);
                }
                tx = x * RV.NowProject.blockSize;
                ty = y * RV.NowProject.blockSize;
                if(isAuto){
                    sp = new ISprite(cof,view);
                    sp.z = z;
                    sp.x = tx;
                    sp.y = ty;
                    mapAuto.push(sp);
                }else{
                    mapSp.drawBitmapBCof(tx , ty , cof , false);
                }
            }else{
                blocks.push(new LBlock(rbb,block,view,x,y,z));
            }
        }

    }


    /**
     * 设置基础图块信息
     * @param x x坐标
     * @param y y坐标
     * @param block 地图图块数据
     * @param rbb 资源图块数据
     */
    function setBaseBlockType(x,y,block,rbb){
        if(block.type == 2){//陷入块单独读取
            if(mapData[x][y] >= 0) return;
            if(rbb.mDie){
                mapData[x][y] = 3000 + rbb.mNum;
            }else{
                mapData[x][y] = 2000 + rbb.mNum;
            }
        }else{
            mapData[x][y] = block.type;
        }

    }



    /**
     * 刷新
     */
    this.update = function(){
        if(isInit) return;
        if(back1 != null){
            back1.x = view.ox / 2;
            back1.y = view.oy;
        }
        for(var i = 0;i<block.length;i++) {
            block[i].update();
        }
        for(i = 0;i<interactionBlock.length;i++){
            interactionBlock[i].update();
        }
        for(i = 0;i<enemys.length;i++){
            enemys[i].update();
        }
        for(i = 0 ; i < trigger.length;i++){
            trigger[i].update();
        }
        if(actor != null){
            actor.update();
            oldVpX = view.ox;
            oldVpY = view.oy;
        }
        updateShack();
        updateViewport();
    };

    /**
     * 释放
     */
    this.dispose = function(noDisposeActor){
        if(back1 != null) back1.dispose();
        if(back2 != null) back2.dispose();
        back1 = null;
        back2 = null;

        mapData = [];

        for(var i = 0;i<mapSprite.length;i++){
            mapSprite[i].dispose();
            mapSprite[i] = null;
        }
        mapSprite = new Array(5);

        for(i = 0;i<mapAuto.length;i++){
            mapAuto[i].disposeMin();
        }

        for(i = 0;i<block.length;i++) {
            block[i].dispose();
        }
        for(i = 0;i<interactionBlock.length;i++){
            interactionBlock[i].dispose();
        }
        for(i = 0;i<enemys.length;i++){
            enemys[i].dispose();
        }
        for(i = 0 ; i < trigger.length;i++){
            trigger[i].dispose();
        }
        if(actor != null && noDisposeActor == null){
            actor.dispose();
        }
        mapAuto = [];
        block = [];
        interactionBlock = [];
        enemys = [];
        trigger = [];
    };

    /**
     * 设置镜头位置
     * @param x
     * @param y
     */
    this.setXY = function(x,y){
        view.ox = x;
        view.oy = y;
    };

    /**
     * 获得地图操作角色
     * @returns {*}
     */
    this.getActor = function(){
        return actor;
    };

    /**
     * 获得地图数据
     * @returns {DMap}
     */
    this.getData = function(){
        return data;
    };

    /**
     * 更改世界重力
     * @param gravity
     */
    this.changeGravityNum = function(gravity){
        //世界重力赋值
        RV.GameData.gravityNum = gravity;
        //修正地图角色重力
        actor.GravityNum = (RV.GameData.gravityNum / 100) * data.gravity;
        actor.Speed[0] = 0;
        //修正触发器重力
        for(var i = 0;i<trigger.length;i++){
            trigger[i].updateGravityNum();
        }
        //修正敌人
        for(i = 0;i<enemys.length;i++){
            enemys[i].updateGravityNum();
        }
        //交互块需要重置相关速度
        for(i = 0;i<interactionBlock.length;i++){
            interactionBlock[i].speed[0] = 0;
        }

    };

    /**
     * 获得地图视窗
     * @returns {IViewport}
     */
    this.getView = function(){
        return view;
    };

    /**
     * 获得地图所有敌人
     * @returns {Array}
     */
    this.getEnemys = function(){
        return enemys;
    };

    /**
     * 获得地图基础图块
     * @returns {Array}
     */
    this.getMapData = function(){
        return mapData;
    };
    /**
     * 获得地图碰撞区域
     */
    this.getMapCurrent = function(){
        return data.current;
    };

    /**
     * 获得地图所有触发器
     * @returns {Array}
     */
    this.getEvents = function(){
        return trigger;
    };

    /**
     * 寻找敌人
     * @param index
     * @returns {null|*}
     */
    this.findEnemy = function(index){
        for(var i = 0;i<enemys.length;i++){
            if(enemys[i].index == index){
                return enemys[i];
            }
        }
        return null;
    };

    /**
     * 寻找触发器
     * @param id
     * @returns {null|*}
     */
    this.findEvent = function(id){
        if(typeof(id)=='string'){
            return _sf.findBlock(id);
        }else{
            for(var i = 0;i<trigger.length;i++){
                if(trigger[i].id == id){
                    return trigger[i];
                }
            }
        }
        return null;
    };

    /**
     * 寻找交互块
     * @param mark
     * @returns {*}
     */
    this.findBlock = function(mark){
        for(var i = 0;i<interactionBlock.length;i++){
            if(interactionBlock[i].mark == mark){
                return interactionBlock[i];
            }
        }
    };


    /**
     * 移动/切换地图
     * @param mapId 地图ID
     * @param x x坐标
     * @param y y坐标
     * @param dir 方向
     * @param end 切换完毕回调
     */
    this.moveMap = function(mapId,x,y,dir,end){
        if(dir < 0) {
            RV.GameData.dir = actor.getDir();
        }else{
            RV.GameData.dir = dir;
        }
        if(mapId == data.id){
            actor.getCharacter().x = x * RV.NowProject.blockSize;
            actor.getCharacter().y = y * RV.NowProject.blockSize;
            actor.stopAction();
            if(dir >= 0){
                actor.getCharacter().setDir(dir);
            }
            end();
            return;
        }

        this.dispose(true);
        data = RV.NowProject.findMap(mapId);
        _sf.id = mapId;
        scene = RV.NowRes.findResMap(data.backgroundId);
        IVal.scene.getMainUI().callBossBar(null);
        width = data.width * RV.NowProject.blockSize;
        height = data.height * RV.NowProject.blockSize;

        if(scene.background1.file != "" && scene.background1.file != null){
            back1 = new ISprite(RF.LoadBitmap("Scene/" + scene.background1.file));
            back1.tiling = scene.background1.type == 0;
            if(back1.tiling){
                back1.RWidth = width;
                back1.RHeight = height;
            }
            back1.z = 1;
        }

        if(scene.background2.file != "" && scene.background1.file != null){
            back2 = new ISprite(RF.LoadBitmap("Scene/" + scene.background2.file),view);
            back2.tiling = scene.background2.type == 0;
            if(back2.tiling){
                back2.RWidth = width;
                back2.RHeight = height;
            }
            back2.z = 2;
        }

        if(data != null){
            loadRes(function(){
                isInit = true;
                init(x,y,false);
                actor.stopAction();
                if(dir >= 0){
                    actor.getCharacter().setDir(dir,false);
                }
                if(_sf.changeMap != null) _sf.changeMap(actor);
                end();
                isInit = false;

            });
        }

    };

    this.saveMap = function(){
        var eny = [];
        for(var i = 0;i<enemys.length;i++){
            if(enemys[i].index >= 0){
                eny[enemys[i].index] = enemys[i].save();
            }
        }
        var tri = [];
        for(i = 0;i<trigger.length;i++){
            tri[trigger[i].id] = trigger[i].save();
        }
        var blk = {};
        for(i = 0;i<interactionBlock.length;i++){
            blk[interactionBlock[i].mark] = interactionBlock[i].save();
        }
        return {
            enemy : eny,
            trigger : tri,
            interactionBlock :blk
        }
    };

    this.loadMap = function(data){
        for(var i = 0;i<enemys.length;i++){
            var index = enemys[i].index;
            if(index >= 0 && data.enemy[index] != null){
                enemys[i].load(data.enemy[index]);
            }
        }
        for(i = 0;i<trigger.length;i++){
            var id = trigger[i].id;
            if(data.trigger[id] != null){
                trigger[i].load(data.trigger[id]);
            }
        }
        for(i = 0;i<interactionBlock.length;i++){
            var mark = interactionBlock[i].mark;
            if(data.interactionBlock[mark] != null){
                interactionBlock[i].load(data.interactionBlock[mark]);
            }
        }

    };

    /**
     * 震动数据初始化
     */
    function shakeInit(){
        oldVpX = view.ox;
        oldVpY = view.oy;
        ShakePower = 0;
        ShakeSpeed = 0;
        ShakeDuration = 0;
        ShakeDirection = 1;
        Shake = 0;
    }

    /**
     * 开始震动
     * @param power 强度
     * @param speed 速度
     * @param duration 事件
     */
    this.startShack = function( power, speed, duration){
        ShakePower = power;
        ShakeSpeed = speed;
        ShakeDuration = duration;
        oldVpX = view.ox;
        oldVpY = view.oy;
        StartShake = true;
    };

    /**
     * 震动数据刷新
     */
    function updateShack(){
        if(ShakeDuration >= 1  || Shake != 0 || ShakeDuration == -1){
            var delta =ShakePower * ShakeSpeed * ShakeDirection / 10.0;
            if( (ShakeDuration != -1 && ShakeDuration <= 1) || Shake * (Shake + delta) < 0){
                Shake = 0;
            }else{
                Shake += delta;
            }
            if(Shake > ShakePower * 2){
                ShakeDirection -= 1;
            }
            if(Shake < -ShakePower * 2){
                ShakeDirection += 1;
            }
            if(ShakeDuration >= 1){
                ShakeDuration -= 1;
            }
            if(Shake == 0 && ShakeDuration >= 1){
                Shake = 1;
            }
        }
    }

    /**
     * 震动视窗刷新
     */
    function updateViewport(){
        if(Shake == 0) {
            if(StartShake){
                StartShake = false;
                view.ox = oldVpX;
                view.oy = oldVpY;
            }
            return;
        }
        var f = rand(0,10);
        view.ox = oldVpX + (f % 2 == 0 ? Shake : Shake * -1);
        f = rand(0,10);
        view.oy = oldVpY + (f % 2 == 0 ? Shake : Shake * -1);
    }

    loadRes(function(){
        isInit = true;
        init(x,y,true);
        func(actor);
        isInit = false;
    });


}/**
 * Created by 七夕小雨 on 2018-2-26.
 * 文本框
 */
function LMessage(){

    var _sf = this;

    var data =  RV.NowUI.ctrls[RV.NowSet.setAll.MsgUIid];
    if(data == null){
        throw "Dialog is not set 文本框未设置"
    }

    this.viewport = new IViewport(0, 0, RV.NowProject.gameWidth, RV.NowProject.gameHeight);
    this.viewport.z = 8000;
    //绘制承载
    this.talkBack = null;
    this.talkDraw = null;
    this.nameBack = null;
    this.nameDraw = null;

    //文本寄存
    this.showText = "";
    this.makeText = "";
    var drawText = "";
    var drawIndex = 0;
    var textGroup = null;

    this.pt = null;
    this.isNext = false;

    this.dx = 0;
    this.dy = 0;
    this.speed = 0;
    this.speedTmp = 0;
    this.isDrawAll = false;

    var color;
    //文本框震动
    var ShakePower,ShakeSpeed,ShakeDuration,ShakeDirection,Shake;

    var fontSize;
    var wait;
    var pass;

    var setB;

    var isInit = false;

    var ctrl = new LCtrl(data , this.viewport , {data:{level:10}} , null);
    var resList = data.getFiles();

    /**
     * 对话框消失
     */
    this.fadeOut = function(){
        if(!isInit) return;
        this.pt.visible = false;
        this.talkBack.visible = false;
        this.talkDraw.visible = false;
        this.nameBack.visible=false;
        this.nameDraw.visible = false;
    };

    DUI.CacheUIRes(resList,initMsg);


    function initMsg(){
        ctrl.initSelfUI();
        _sf.talkBack = ctrl.msgBack;
        _sf.talkDraw = ctrl.msgText;
        _sf.talkDraw.disposeBitmap();
        _sf.talkDraw.setBitmap(IBitmap.CBitmap(_sf.talkBack.width , _sf.talkBack.height));
        _sf.talkDraw.width = _sf.talkBack.width;
        _sf.talkDraw.height = _sf.talkBack.height;
        _sf.nameBack = ctrl.nameBack;
        _sf.nameDraw = ctrl.nameText;
        _sf.nameDraw.disposeBitmap();
        _sf.nameDraw.setBitmap(IBitmap.CBitmap(_sf.nameBack.width , _sf.nameBack.height));
        _sf.pt = ctrl.tips;
        _sf.pt.addAction(action.move, _sf.pt.x,_sf.pt.y,20);
        _sf.pt.addAction(action.wait, 20);
        _sf.pt.addAction(action.move, _sf.pt.x,_sf.pt.y + 5,20);
        _sf.pt.addAction(action.wait, 20);
        _sf.pt.actionLoop = true;
        _sf.pt.visible = false;
        ctrl.x = (RV.NowProject.gameWidth - ctrl.width) / 2;
        isInit = true;
        _sf.fadeOut();
    }
    //震动相关
    ShakePower = 0;
    ShakeSpeed = 0;
    ShakeDuration = 0;
    ShakeDirection = 1;
    Shake = 0;
    var noLatin = false;

    /**
     * 消失
     */
    this.re = function(){
        setB = true;
        this.viewport.x = 0;
        this.viewport.y = 0;
        this.fadeOut();
    };

    /**
     * 设置文本框位置
     * @param b 可见情况
     * @param point 位置
     */
    this.setThis = function( b,point){
        _sf.nameBack.visible = b;
        _sf.talkBack.visible = b;
        setB = b;
        _sf.pt.visible = b;
        _sf.viewport.x = 0;
        if(point == 0){
            _sf.viewport.y = 0;
        }else if(point == 1){
            _sf.viewport.y =  (RV.NowProject.gameHeight - ctrl.height) / 2;
        }else if(point == 2){
            _sf.viewport.y = RV.NowProject.gameHeight - ctrl.height - 20
        }

    };

    /**
     * 开始震动
     * @param power 强度
     * @param speed 速度
     * @param duration 时间
     * @constructor
     */
    this.StartShack = function( power, speed, duration){
        ShakePower = power;
        ShakeSpeed = speed;
        ShakeDuration = duration;
    };

    /**
     * 整栋循环处理
     */
    function updateShack(){
        if(ShakeDuration >= 1  || Shake != 0 || ShakeDuration == -1){
            var delta = ( ShakePower * ShakeSpeed * ShakeDirection / 10.0);
            if( (ShakeDuration != -1 && ShakeDuration <= 1) || Shake * (Shake + delta) < 0){
                Shake = 0;
            }else{
                Shake += delta;
            }
            if(Shake > ShakePower * 2){
                ShakeDirection -= 1;
            }
            if(Shake < -ShakePower * 2){
                ShakeDirection += 1;
            }
            if(ShakeDuration >= 1){
                ShakeDuration -= 1;
            }
            if(Shake == 0 && ShakeDuration >= 1){
                Shake = 1;
            }
        }
    }

    /**
     * 更新震动视窗
     */
    function updateViewPort(){
        var f = rand(0,10);
        _sf.viewport.ox = f % 2 == 0 ? Shake : Shake * -1;
        f = rand(0,10);
        _sf.viewport.oy = f % 2 == 0 ? Shake : Shake * -1;
    }

    /**
     * 绘制名称
     * @param name 名称
     */
    function drawName( name){
        if(name.length <= 0){
            _sf.nameDraw.visible = false;
            _sf.nameBack.visible = false;
            return;
        }else {
            _sf.nameDraw.visible = true;
            _sf.nameBack.visible = setB;
        }
        var fontSize = "\\s["+ _sf.nameDraw.data.fontSize + "]";
        LUI.setText(_sf.nameDraw,fontSize + name);
        _sf.nameBack.width = _sf.nameDraw.width + _sf.nameDraw.data.x * 2;
        LUI.RePoint(_sf.nameDraw,ctrl.ctrlItems,0,0);
    }

    /**
     * 文本框是否还在显示文字过程中
     * @returns {boolean}
     */
    this.isShowing = function(){
        return this.showText.length > 0;
    };

    /**
     * 主绘制
     */
    this.updateDraw = function(){
        if(!isInit) return;
        updateShack();
        updateViewPort();
        if(this.showText == null || this.showText.length <= 0){
            this.pt.visible = this.talkBack.visible;
            return;
        }
        if(pass){
            this.pt.visible = this.talkBack.visible;
            if(RF.IsNext()){
                IInput.up = false;
                pass = false;
            }
            return;
        }
        if(RF.IsNext()){
            IInput.up = false;
            this.isDrawAll = true;
            _sf.speed = 0;
            _sf.speedTmp = 0;
            return
        }
        if(wait > 0){
            wait -= 1;
            return;
        }

        if(this.speedTmp > 0){
            this.speedTmp -= 1;
            return;
        }else{
            this.speedTmp = this.speed;
        }

        while (true) {
            if(drawText == null || drawText.length <= 0 && drawIndex + 1 < textGroup.length){
                drawIndex += 1;
                drawText = RF.TextAnalysis(textGroup[drawIndex]);
                var w = getDrawTextW(drawText,fontSize);
                if(_sf.dx + w >= this.talkDraw.width - (this.talkDraw.data.x * 2)){
                    _sf.dy +=  (IFont.getHeight(min, fontSize) * 1.2);
                    _sf.dx = 0;
                }
            }

            if(drawText.length <= 0){
                break;
            }
            var min = drawText.substring(0,1);
            drawText = drawText.substring(1 , drawText.length);
            var c = min.charCodeAt(0);
            if(c == 60000){//换行
                this.dy += (IFont.getHeight(min, 20) * 1.3);
                this.dx = 0;
            }else if(c == 60001){//更改颜色
                var returnS = TextToTemp(drawText,"[","]","\\[([0-9]+[，,][0-9]+[，,][0-9]+)]");
                color = new IColor(returnS[0]);
                drawText = returnS[1];
            }else if(c == 60002){//更改字体大小
                returnS = TextToTemp(drawText , "[","]","\\[([0-9]+)]");
                fontSize = parseInt(returnS[0]);
                drawText = returnS[1];
            }else if(c == 60100){
                //this.showText = RV.User.name + this.showText;
                break;
            }else if(c == 60101){//全部显示
                this.isDrawAll = true;
                _sf.speed = 0;
                _sf.speedTmp = 0;
                break;
            }else if(c == 60102){//等待10帧
                wait = 10;
                break;
            }else if(c == 60103){//等待20帧
                wait = 20;
                break;
            }else if(c == 60104){//等待指定
                returnS = TextToTemp(drawText , "[","]","\\[([0-9]+)]");
                wait = parseInt(returnS[0]);
                drawText = returnS[1];
                break;
            }else if(c == 60105){//自动结束本对话
                this.isNext = true;
                break;
            }else if(c == 60106){//暂停
                pass = true;
                break;
            }else if(c == 60003){//显示变量
                returnS = TextToTemp(drawText , "[","]","\\[([a-zA-Z0-9-_]+)]");
                drawText = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
            }else {
                this.talkDraw.drawTextQ(min, _sf.dx, _sf.dy, color, fontSize);
                _sf.dx += IFont.getWidth(min,fontSize);
                if(_sf.dx > this.talkDraw.width - (this.talkDraw.data.x * 2)){
                    _sf.dx = 0;
                    _sf.dy += (IFont.getHeight(min, fontSize) * 1.2);
                }
            }



            if(!this.isDrawAll){
                break;
            }
        }

        if( (drawText == null || drawText.length <= 0) && drawIndex + 1 >= textGroup.length){
            _sf.showText = "";
        }



    };

    function getDrawTextW(msg,fs){
        var showText = new String(msg);
        var fontSize = fs;
        var nowW = 0;
        var dx = 0;
        var dy = 0;
        while (true) {
            if(showText.length <= 0){
                break;
            }
            var min = showText.substring(0,1);
            showText = showText.substring(1,showText.length);
            var c = min.charCodeAt(0);
            if(c == 60000){//换行
                dy += (IFont.getHeight(min, fontSize) * 1.2);
                dx = 0;
            }else if(c == 60001){//改变颜色
                var returnS = TextToTemp(showText,"[","]","\\[([0-9]+[，,][0-9]+[，,][0-9]+)]");
                color = new IColor(returnS[0]);
                showText = returnS[1];
            }else if(c == 60002){//改变字号
                returnS = TextToTemp(showText , "[","]","\\[([0-9]+)]");
                fontSize = parseInt(returnS[0]);
                showText = returnS[1];
            }else if(c == 60100){
            }else if(c == 60101){//全部显示
            }else if(c == 60102){//等待10帧
            }else if(c == 60103){//等待20帧
            }else if(c == 60104){//等待指定
                returnS = TextToTemp(showText , "[","]","\\[([0-9]+)]");
                showText = returnS[1];
            }else if(c == 60105){//去往下段对话
            }else if(c == 60106){//暂停
            }else if(c == 60003){//显示变量
                returnS = TextToTemp(showText , "[","]","\\[([a-zA-Z0-9-_]+)]");
                showText = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
            }else {
                dx += IFont.getWidth(min,fontSize);
                if(dx > nowW){
                    nowW = dx;
                }
            }
        }
        return nowW;
    }

    /**
     * 设置对话
     * @param name 名称
     * @param msg 内容
     */
    this.talk = function( name, msg){
        wait = 0;
        this.pt.visible = false;
        _sf.fadeIn();
        drawName(name);
        fontSize = this.talkDraw.data.fontSize;
        this.makeText = msg;
        textGroup = IFont.toGroups(msg);
        drawIndex = -1;
        drawText = "";
        this.talkDraw.clearBitmap();
        this.talkDraw.updateBitmap();
        noLatin = RF.CheckLanguage(msg);
        this.showText = RF.TextAnalysis(this.makeText);
        this.talkBack.visible = true;
        this.dx = 0;
        this.dy = 0;
        this.isDrawAll = false;
        color = this.talkDraw.data.fontColor.IColor();
        this.speed = 2;
        this.speedTmp = this.speed;
        this.talkBack.visible = setB;
        this.talkDraw.visible = true;
        this.isNext = false;
    };



    /**
     * 对话框出现
     */
    this.fadeIn = function(){
        if(!isInit) return;
        this.pt.visible = setB;
        this.talkBack.visible = setB;
        this.talkDraw.visible = setB;
        this.nameBack.visible = setB;
        this.nameDraw.visible = setB;
    };

    /**
     * 文字正则提取
     * @param mainText 需要提取的字符串
     * @param s 前置特殊标志
     * @param e 后置特殊标志
     * @param rex 正则表达式
     * @returns {*[]} 提取后的内容
     */
    function TextToTemp( mainText, s, e, rex){
        var tmp = mainText.substring(mainText.indexOf(s) + 1,mainText.indexOf(e));
        mainText = mainText.substring(tmp.length + s.length + e.length, mainText.length);
        var temp1 = tmp.replaceAll(rex, "$1");
        var temp_2 = temp1.replaceAll(" ", "");
        var temp_e = temp_2.replaceAll("，", ",");
        return [temp_e,mainText];
    }

    /**
     * 释放
     */
    this.dispose = function(){
        this.pt.disposeMin();
        this.nameBack.dispose();
        this.nameDraw.dispose();
        this.talkBack.dispose();
        this.talkDraw.dispose();
        //this.pointText.dispose();
        this.viewport.dispose();
    };

    /**
     * 设置z坐标
     * @param z
     */
    this.setZ = function(z){
        this.viewport.z = z;
    };

}/**
 * Created by 七夕小雨 on 2018/7/17.
 * 对话框
 * @param vp 承载视窗
 */
function LMessagePop(vp){

    var _sf = this;

    var data =  RV.NowUI.ctrls[RV.NowSet.setAll.talkUIid];
    if(data == null){
        throw "Dialog is not set 对话框未设置"
    }
    var nameBackData = data.findData("nameBack");
    var nameTextData = data.findData("nameText");
    var msgBackData = data.findData("msgBack");
    var msgTextData = data.findData("msgText");
    var pointData = data.findData("point");
    if(nameBackData  == null || nameTextData == null || msgBackData == null || msgTextData == null || pointData == null){
        throw "对话框缺少Key为nameBack或nameText或msgBack或msgText或point的控件。"
    }

    //姓名框
    var name = new UAutoPic(999999 + 12 , nameBackData , vp);
    name.width = nameBackData.width;
    name.height = nameBackData.height;
    name.visible = false;
    name.z = 999999 + 12;
    //姓名框绘制部分
    var nameDraw = new ISprite(IBitmap.CBitmap(name.width,name.height),vp);
    nameDraw.z = 999999 + 13;
    nameDraw.data = nameTextData;
    //主框部分
    var main = new UAutoPic(999999 + 10 , msgBackData , vp);
    main.width = msgBackData.width;
    main.height = msgBackData.height;
    main.z = 999999 + 10;
    main.visible = false;
    var mainDraw = new ISprite(IBitmap.CBitmap(msgBackData.width,960),vp);
    mainDraw.z = 999999 + 11;
    var lineSize = msgBackData.width - (msgTextData.x * 2);
    //对话框尖尖图片
    var pos2 =  RF.LoadCache(pointData.getFiles()[0]);
    //文字绘制间隔
    var wait = 0;
    //当前绘制文字
    var showText = "";
    var drawText = "";
    var drawIndex = 0;
    var textGroup = null;
    //暂停等待按下
    var pass = false;
    //速度
    var speed = 2;
    //上次速度
    var speedTmp = speed;
    //偏移
    var dx = 0;
    var dy = 0;
    //文字颜色
    var color = null;
    var fontSize = 16;

    //目标对象ID
    var nowID = -1;

    var posSprite = new ISprite(pos2,vp);
    posSprite.z = 999999 + 14;

    this.isDrawAll = false;
    this.isNext = false;


    var noLatin = false;

    /**
     * 对话框消失
     */
    this.none = function(){
        name.visible = false;
        nameDraw.visible = false;
        if(main != null){
            main.visible = false;
            mainDraw.visible = false;
        }
        posSprite.visible = false;
    };

    /**
     * 是否还在显示文字过程中
     * @returns {boolean}
     */
    this.isShowing = function(){
        return showText.length > 0;
    };

    /**
     * 设置动画
     * @param nm 名称
     * @param msg 内容
     * @param id 目标id -10 为角色自己 -20 为当前触发器
     */
    this.talk = function(nm,msg,id){
        nowID = id;
        //初始化内容
        speed = 2;
        speedTmp = speed;
        dx = 0;
        dy = 0;
        color = msgTextData.fontColor.IColor();
        fontSize = msgTextData.fontSize;
        this.isDrawAll = false;
        this.isNext = false;
        name.visible = false;
        nameDraw.visible = false;
        if(nm != null && nm.length > 0 && nm != " "){
            name.visible = true;
            nameDraw.visible = true;
            makeName(nm);
            name.width = Math.max(nameDraw.width + nameTextData.x * 2,60);
        }
        makeBlock(msg);
        posSprite.visible = true;
        var point = getShowPoint(id);
        updateTalkPoint(point);

    };

    function updateTalkPoint(point){
        posSprite.y = point.y - 5;
        main.x = point.x - (main.width - posSprite.width) / 2;
        main.y = posSprite.y - main.height - pointData.y + posSprite.height;
        mainDraw.x = main.x + msgTextData.x;
        mainDraw.y = main.y + msgTextData.y;
        name.x = main.x + nameBackData.x;
        name.y = main.y - msgBackData.y;
        nameDraw.x = name.x + nameTextData.x;
        nameDraw.y = name.y + nameTextData.y;
    }

    function getShowPoint(id){
        var endX = 0;
        var endY = 0;
        //计算相对显示位置
        if(id == -10){
            var actor = RV.NowMap.getActor().getCharacter().getSpirte();
            endY = actor.y ;
            endX = actor.x + (actor.width) / 2;
            posSprite.x = endX - (posSprite.width / 2);
        }else{
            if(id == -20){
                id = RV.NowEventId;
            }
            var event = RV.NowMap.findEvent(id);
            if(event != null){
                var char = event.getCharacter();
                var rect = null;
                if(char != null){
                    rect = char.getCharacter().getSpirte().GetRect();
                }else{
                    rect = event.getRect();
                }
                if(rect != null){
                    endX = rect.left + (rect.width) / 2;
                    endY = rect.top;
                    posSprite.x = endX - (posSprite.width / 2);
                }


            }
        }
        if(endX - (main.width / 2) < 0){
            endX = (main.width / 2);
        }
        if(endX + (main.width / 2) > RV.NowMap.getData().width * RV.NowProject.blockSize){
            endX = RV.NowMap.getData().width * RV.NowProject.blockSize - (main.width /2 );
        }
        return {x:endX,y:endY};
    }

    /**
     * 绘制姓名
     * @param name 姓名
     */
    function makeName(name){
        LUI.setText(nameDraw,name);
    }

    /**
     * 绘制背板
     * @param msg 文字
     * @param bmp 图片集合
     */
    function makeBlock(msg,bmp){
        textGroup = IFont.toGroups(msg);
        showText = msg;
        drawText = "";
        drawIndex = -1;
        var width = msgTextData.x * 2 + 32;
        var height =  msgTextData.y + IFont.getHeight("A", fontSize) * 1.2 + 20;
        main.width = width;
        main.height = height;
        main.visible = true;
        mainDraw.visible = true;
        mainDraw.clearBitmap();
    }

    /**
     * 更新显示位置
     */
    function updatePoint(){
        var point = getShowPoint(nowID);
        updateTalkPoint(point);
    }

    /**
     * 主绘制
     */
    this.update = function(){
        updatePoint();
        if(showText == null || showText.length <= 0){
            return;
        }
        if(pass){
            if(RF.IsNext()){
                IInput.up = false;
                pass = false;
            }
            return;
        }
        if(RF.IsNext()){
            IInput.up = false;
            this.isDrawAll = true;
            _sf.speed = 0;
            _sf.speedTmp = 0;
            return;
        }
        if(wait > 0){
            wait -= 1;
            return;
        }

        if(speedTmp > 0){
            speedTmp -= 1;
            return;
        }else{
            speedTmp = speed;
        }

        while (true) {
            if(drawText == null || drawText.length <= 0 && drawIndex + 1 < textGroup.length){
                drawIndex += 1;
                drawText = RF.TextAnalysis(textGroup[drawIndex]);
                var w = getDrawTextW(drawText,fontSize);
                if(dx + w >= lineSize){
                    var lineHeight = (IFont.getHeight(min, fontSize) * 1.2);
                    dy += lineHeight;
                    main.height += lineHeight;
                    dx = 0;
                }
            }

            if(drawText.length <= 0){
                break;
            }
            var min = drawText.substring(0,1);
            drawText = drawText.substring(1,drawText.length);
            var c = min.charCodeAt(0);
            if(c == 60000){//换行
                lineHeight = (IFont.getHeight(min, fontSize) * 1.2);
                dy += lineHeight;
                main.height += lineHeight;
                dx = 0;
            }else if(c == 60001){//改变颜色
                var returnS = TextToTemp(drawText,"[","]","\\[([0-9]+[，,][0-9]+[，,][0-9]+)]");
                color = new IColor(returnS[0]);
                drawText = returnS[1];
            }else if(c == 60002){//改变字号
                returnS = TextToTemp(drawText , "[","]","\\[([0-9]+)]");
                fontSize = parseInt(returnS[0]);
                drawText = returnS[1];
            }else if(c == 60100){
                break;
            }else if(c == 60101){//全部显示
                this.isDrawAll = true;
                _sf.speed = 0;
                _sf.speedTmp = 0;
                break;
            }else if(c == 60102){//等待10帧
                wait = 10;
                break;
            }else if(c == 60103){//等待20帧
                wait = 20;
                break;
            }else if(c == 60104){//等待指定
                returnS = TextToTemp(drawText , "[","]","\\[([0-9]+)]");
                wait = parseInt(returnS[0]);
                drawText = returnS[1];
                break;
            }else if(c == 60105){//去往下段对话
                this.isNext = true;
                break;
            }else if(c == 60106){//暂停
                pass = true;
                break;
            }else if(c == 60003){//显示变量
                returnS = TextToTemp(drawText , "[","]","\\[([a-zA-Z0-9-_]+)]");
                drawText = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
            }else {
                mainDraw.drawTextQ(min, dx, dy, color, fontSize);
                dx += IFont.getWidth(min,fontSize);
                if(dx + msgTextData.x * 2 > main.width){
                    main.width = dx + msgTextData.x * 2;
                }
                if(dx > lineSize){
                    dx = 0;
                    lineHeight = (IFont.getHeight(min, fontSize) * 1.2);
                    dy += lineHeight;
                    main.height += lineHeight;
                }
            }
            if(!this.isDrawAll){
                break;
            }
        }


        if( (drawText == null || drawText.length <= 0) && drawIndex + 1 >= textGroup.length){
            showText = "";
        }
    };

    function getDrawTextW(msg,fs){
        var showText = new String(msg);
        var fontSize = fs;
        var nowW = 0;
        var dx = 0;
        var dy = 0;
        while (true) {
            if(showText.length <= 0){
                break;
            }
            var min = showText.substring(0,1);
            showText = showText.substring(1,showText.length);
            var c = min.charCodeAt(0);
            if(c == 60000){//换行
                dy += (IFont.getHeight(min, fontSize) * 1.2);
                dx = 0;
            }else if(c == 60001){//改变颜色
                var returnS = TextToTemp(showText,"[","]","\\[([0-9]+[，,][0-9]+[，,][0-9]+)]");
                color = new IColor(returnS[0]);
                showText = returnS[1];
            }else if(c == 60002){//改变字号
                returnS = TextToTemp(showText , "[","]","\\[([0-9]+)]");
                fontSize = parseInt(returnS[0]);
                showText = returnS[1];
            }else if(c == 60100){
            }else if(c == 60101){//全部显示
            }else if(c == 60102){//等待10帧
            }else if(c == 60103){//等待20帧
            }else if(c == 60104){//等待指定
                returnS = TextToTemp(showText , "[","]","\\[([0-9]+)]");
                showText = returnS[1];
            }else if(c == 60105){//去往下段对话
            }else if(c == 60106){//暂停
            }else if(c == 60003){//显示变量
                returnS = TextToTemp(showText , "[","]","\\[([a-zA-Z0-9-_]+)]");
                showText = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
            }else {
                dx += IFont.getWidth(min,fontSize);
                if(dx > nowW){
                    nowW = dx;
                }
            }
        }
        return nowW;
    }

    /**
     * 文字正则提取
     * @param mainText 需要提取的字符串
     * @param s 前置特殊标志
     * @param e 后置特殊标志
     * @param rex 正则表达式
     * @returns {*[]} 提取后的内容
     */
    function TextToTemp( mainText, s, e, rex){
        var tmp = mainText.substring(mainText.indexOf(s) + 1,mainText.indexOf(e));
        mainText = mainText.substring(tmp.length + s.length + e.length, mainText.length);
        var temp1 = tmp.replaceAll(rex, "$1");
        var temp_2 = temp1.replaceAll(" ", "");
        var temp_e = temp_2.replaceAll("，", ",");
        return [temp_e,mainText];
    }

    /**
     * 释放
     */
    this.dispose = function(){
        posSprite.disposeMin();
        name.dispose();
        nameDraw.dispose();
        main.dispose();
        mainDraw.dispose();
    };

}/**
 * Created by 七夕小雨 on 2019/4/17.
 * 伤害数字逻辑处理
 * @param type 数字类型 0、一般伤害 1、暴击伤害 2、蓝耗 3、MISS
 * @param num 具体数字
 * @param view 承载视窗
 * @param x x坐标
 * @param y y坐标
 */
function LNum(type,num,view,x,y){

    var _sf = this;
    var sprite = null;
    var bitmap = null;

    this.endDo = null;
    if(type == 0 || type == 1){//生命
        if(num >= 0){//造成的伤害
            if(type == 1){//暴击
                bitmap = RV.NumberPics[3];
            }else{//正常
                bitmap = RV.NumberPics[0];
            }
        }else if(num < 0){//相当于是加血了
            bitmap = RV.NumberPics[1];
        }
    }else if(type == 2){//蓝耗
        bitmap = RV.NumberPics[2];
    }else if(type == 3){//miss
        bitmap = RV.NumberPics[4];
    }

    if(bitmap != null){
        if(type == 3){
            sprite = new ISprite(bitmap,view);
            sprite.z = 400;
            sprite.x = x;
            sprite.y = y;
            sprite.speedY = -1 * rand(3,5);
            sprite.speedX = rand(1,2);
            sprite.aSpeedY = 0.3;
            sprite.fadeTo(0,80);
            sprite.setOnEndFade(function(){
                sprite.disposeMin();
                if(_sf.endDo != null) _sf.endDo();
            });
            return;
        }

        var minW = parseInt(bitmap.width / 10);
        var minH = parseInt(bitmap.height);

        num = Math.abs(num);
        num = parseInt(num);
        var s = num + "";
        var ary = s.split("");
        var w = s.length;
        sprite = new ISprite(IBitmap.CBitmap(w * minW,minH) , view);
        sprite.z = 400;
        for(var i = 0;i<ary.length;i++){
            var n = parseInt(ary[i]);
            var bCof = new IBCof(bitmap , n * minW , 0 , minW , minH);
            sprite.drawBitmapBCof(i * bCof.width,0,bCof,false);
        }

        sprite.x = x;
        sprite.y = y;
        sprite.speedY = -1 * rand(3,5);
        sprite.speedX = rand(1,2);
        sprite.aSpeedY = 0.3;
        sprite.fadeTo(0,80);
        sprite.setOnEndFade(function(){
            sprite.disposeMin();
            if(_sf.endDo != null) _sf.endDo();
        });
    }

}/**
 * Created by 七夕小雨 on 2019/4/8.
 * 粒子动画
 * @param res 资源ID
 * @param view 视窗
 * @param isSingle 是否播放一遍
 * @param actor 相对Actor
 * @param rect 相对Rect
 * @constructor
 */
function LParticle(res,view,isSingle,actor,rect){
    var _sf = this;
    //相对运动区域
    this.userRect = rect;
    //数据
    var data = res;
    //资源读取
    var bitmaps = [];
    for(var i = 0;i<data.files.length;i++){
        bitmaps[i] = RF.LoadCache("Animation/" + data.files[i]);
    }
    //粒子数量
    var num = data.number;
    this.line = data.distance;
    this.dir = data.dir;

    //粒子区域
    this.rect = new IRect(0, 0, data.width, data.height);
    this.radii = data.radius;
    this.x = 0;
    this.y = 0;
    //重力
    this.isG = data.isGravity;
    //结束回调
    this.endDo = null;
    this.tag   = null;

    var playOne = isSingle;
    var endPlay = false;


    var type = data.launchType;
    var time = data.time;

    var pos = 0;
    var sprites = [];
    if(bitmaps.length > 0){
        sprites = new Array(num);
        for (i = 0; i < num; i++) {
            if(bitmaps[pos] != null) {
                sprites[i] = new ISprite( bitmaps[pos] , view);
                sprites[i].x = this.rect.left + rand(0, this.rect.width);
                sprites[i].y = this.rect.top + rand(0, this.rect.height);
                sprites[i].z = 9999;
                sprites[i].opacity = 0;
                pos = i % bitmaps.length;
            }
        }
    }


    data.sound.play();

    /**
     * 主循环
     */
    this.update = function() {
        if (sprites == null) return;
        if(data.point.type == 0){
            this.pointUpdate();
        }
        var noneCount = 0;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] == null) continue;
            if (sprites[i].opacity > 0) {
                if(sprites[i].tag == null) {
                    sprites[i].opacity = 0;
                    return;
                }else {
                    var temp = sprites[i].tag;
                    sprites[i].opacity -= temp[0];
                    sprites[i].x += temp[1];
                    sprites[i].y += temp[2];
                    if (this.isG) {
                        temp[2] += 0.1;
                    }
                }
            } else {
                if(sprites[i].tag != null && sprites[i].opacity <= 0 && playOne) {
                    noneCount += 1;
                    continue;
                }
                if (type == 1) {
                    var ftime = (time / 2) + rand(0, time);
                    sprites[i].opacity = 1.0;
                    var difO = 1.0 / (ftime * 1.0);

                    var difX = 0;
                    var difY = 0;
                    sprites[i].x = this.rect.left + rand(0, this.rect.width);
                    sprites[i].y = this.rect.top + rand(0, this.rect.height);
                    sprites[i].zoomX = sprites[i].zoomY = 1.0 - 0.5 * Math.random();
                    switch (this.dir) {
                        case 0:
                            difY = ((sprites[i].y - this.line) - sprites[i].y) / (ftime * 1.0);
                            break;
                        case 1:
                            difY = ((sprites[i].y + this.line) - sprites[i].y) / (ftime * 1.0);
                            break;
                        case 2:
                            difX = ((sprites[i].x - this.line) - sprites[i].x) / (ftime * 1.0);
                            break;
                        case 3:
                            difX = ((sprites[i].x + this.line) - sprites[i].x) / (ftime * 1.0);
                            break;
                    }
                    sprites[i].tag = [difO, difX, difY];
                } else if (type == 0) {
                    var d = rand(0, 360);
                    var angle = Math.PI * (d * 1.0) / 180.0;
                    var endX = this.x + parseInt(Math.cos(angle) * this.radii);
                    var endY = this.y + parseInt(Math.sin(angle) * this.radii);
                    sprites[i].opacity = 1.0;
                    sprites[i].angle = rand(0, 360);
                    ftime = (time / 2) + rand(0, time);

                    difO = 1.0 / (ftime * 1.0);
                    difX = (endX - this.x) / (ftime * 1.0);
                    difY = (endY - this.y) / (ftime * 1.0);
                    sprites[i].x = this.x;
                    sprites[i].y = this.y;
                    sprites[i].zoomX = sprites[i].zoomY = 1.0 - 0.* Math.random();
                    sprites[i].tag = [ difO, difX, difY ];
                }
            }
        }
        if(noneCount >= sprites.length - 1 && playOne && this.endDo != null){
            this.endDo();
            this.endDo = null;
        }

    };

    /**
     * 坐标刷新
     */
    this.pointUpdate = function(){
        var x = 0;
        var y = 0;
        var point = data.point;
        if(point.type === 0){//相对坐标

            var rect = null;
            if(actor != null){
                if(actor instanceof  LTrigger){
                    rect = actor.getCharacter().getShowRect();
                }else if(actor instanceof LActor){
                    rect = actor.getShowRect();
                }else if(actor instanceof LEnemy){
                    rect = actor.getCharacter().getShowRect();
                }else if(actor instanceof LInteractionBlock){
                    rect = actor.getSprite().GetRect();
                }
            }else if(_sf.userRect != null){
                rect = _sf.userRect;
            }else{
                rect = new IRect(1,1,1,1);
            }

            if(point.dir === 0){//中心
                x = rect.x + rect.width / 2;
                y = rect.y + rect.height / 2;
            }else if(point.dir === 1){//上
                x = rect.x + rect.width / 2;
                y = rect.y;
            }else if(point.dir === 2){//下
                x = rect.x + rect.width / 2;
                y = rect.bottom;
            }else if(point.dir === 3){//左
                x = rect.x;
                y = rect.y + rect.height / 2;
            }else if(point.dir === 4){//右
                x = rect.right;
                y = rect.y + rect.height / 2;
            }else if(point.dir === 5){//画面
                x = 0;
                y = 0;
            }

        }else{//绝对坐标
            x = point.x;
            y = point.y;
        }
        if(type === 0){
            this.x = x;
            this.y = y;

        }else{
            var w = this.rect.width;
            var h = this.rect.height;
            this.rect.left = x - w / 2 ;
            this.rect.top = y - h / 2 ;
            this.rect.right = this.rect.left + w;
            this.rect.bottom = this.rect.top + h;
        }

    };

    this.pointUpdate();

    /**
     * 释放
     */
    this.dispose = function(){
        if(sprites == null) return;
        for (var i = 0; i < sprites.length; i++) {
            sprites[i].disposeMin();
        }
        sprites = null;
    };

    /**
     * 获得矩形
     * @returns {IRect}
     */
    this.getRect = function(){
        return new IRect(this.x,this.y,1,1);
    }



}/**
 * Created by 七夕小雨 on 2018-2-9.
 * 特殊天气粒子效果
 * @param bmps 粒子图片
 * @param num 粒子数量
 * @param z z图层
 * @param vp 视窗
 */
function LPetal(bmps, num, z, vp){
    var sps = [];

    if(bmps.length <= 0) return;
    for (var i = 0; i < num; i++) {
        sps[i] = new ISprite(bmps[rand(0,bmps.length - 1)]);
        sps[i].z = z + i;
        sps[i].zoomX = sps[i].zoomY = 0.1 + (0.2 * (rand(0,100) * 1.0 / 100.0));
        sps[i].x = -50 - rand(0,RV.NowProject.gameWidth);
        sps[i].y = -100 + rand(0,150);
        sps[i].startRotate((rand(0,100) * 1.0 / 100.0));
        sps[i].tag = [20+rand(0,200),10+rand(0,100)];
    }

    this.update = function(){
        for (var i = 0; i < sps.length; i++) {
            var speed = sps[i].tag;
            var speedx = speed[0] * 1.0 / 100;
            var speedy = speed[1] * 1.0 / 100;
            sps[i].x += speedx;
            sps[i].y += speedy;
            if(sps[i].x > RV.NowProject.gameWidth || sps[i].y > RV.NowProject.gameHeight){
                sps[i].zoomX = sps[i].zoomY = 0.1 + (0.2 * (rand(0,100) * 1.0 / 100.0));
                sps[i].x = -50 - rand(0,RV.NowProject.gameWidth);
                sps[i].y = -100 + rand(0,150);
                sps[i].startRotate((rand(0,100) * 1.0 / 100.0));
                sps[i].tag = [20+rand(0,200),10+rand(0,100)];
            }
        }
    };

    this.dispose = function(){
        for (var i = 0; i < sps.length; i++) {
            sps[i].disposeMin();
        }
    }
}

LPetal.Play = function(bmps, zoomMin, zoomMax, time){
    var num = 40;
    for (var i = 0; i < num; i++) {
        if(LPetal.disSps[i] == null){
            LPetal.disSps[i] = new ISprite(bmps[rand(0,bmps.length)]);
            LPetal.disSps[i].z = 99999 + i;
        }
        LPetal.disSps[i].zoomX = LPetal.disSps[i].zoomY = zoomMin + (zoomMax * (rand(0,100) * 1.0 / 100.0));
        LPetal.disSps[i].x = -50 - rand(0,300);
        LPetal.disSps[i].y = rand(0,300);
        LPetal.disSps[i].startRotate((rand(0,100) * 1.0 / 100.0));
        var endy = rand(0,800);
        var timeNew =  (time + time * rand(0,300) / 100.0);
        LPetal.disSps[i].slideTo(550, endy,timeNew);
        LPetal.disSps[i].scaleTo(LPetal.disSps[i].zoomX * 0.5, LPetal.disSps[i].zoomX * 0.5, timeNew);
    }
};

LPetal.disSps = [];
/**
 * Created by 七夕小雨 on 2019/5/28.
 * 技能逻辑处理类
 * @param actor LActor对象
 * @param data 技能配置数据
 * @param user 触发对象
 */
function LSkill(actor , data , user) {
    //技能释放流程
    //1、吟唱阶段，如果没有吟唱动画则没有吟唱动作（吟唱中是可以被打断的）
    //2、技能准备阶段 执行公共事件，准备锁定方向，准备霸体，释放区域等
    //3、技能开始阶段播放技能动画，执行公共事件，结算相应的伤害
    //4、技能结束阶段恢复技能状态

    var _sf = this;
    var cof = data;
    var isSelf = actor === RV.NowMap.getActor();
    var char = actor.getCharacter();

    var step = 0;//0 吟唱阶段  1 准备阶段  2执行阶段 3结束阶段
    var stepWait = 0;
    var oldFixedOrientation = false;

    var rectSprite = null;

    var throwTimes = cof.launchTimes;
    var throwInterval = 0;

    var nowMoveTime = cof.moveTime;

    var chantAnim = false ;
    var chantAction = false;
    var selecting = false;
    var selectime = 120;

    var overAnim = false;
    var overMove = false;

    var doing = false;

    var userRect = new IRect(1,1,1,1);

    this.endDo = null;

    //射击坐标，请保证射击技能必然包含子弹位置
    var throwX = 0;
    var throwY = 0;

    //基础伤害计算
    var hurt = cof.pow;
    hurt += cof.pow * (user.getMaxHP() / 9999) * (cof.maxHP / 100);
    hurt += cof.pow * (user.getMaxMp() / 9999) * (cof.maxHP / 100);
    hurt += cof.pow * (user.hp / user.getMaxHP()) * (cof.Hp / 100);
    hurt += cof.pow * (user.mp / user.getMaxMp()) * (cof.Mp / 100);
    hurt += cof.pow * (user.getWAtk() / 999) * (cof.watk / 100);
    hurt += cof.pow * (user.getWDef() / 999) * (cof.wdef / 100);
    hurt += cof.pow * (user.getMAtk() / 999) * (cof.matk / 100);
    hurt += cof.pow * (user.getMDef() / 999) * (cof.mdef / 100);
    hurt += cof.pow * (user.getSpeed() / 999) * (cof.speed / 100);
    hurt += cof.pow * (user.getLuck() / 999) * (cof.luck / 100);

    stepChant();

    //检测是否还有别的技能
    if(actor.nowSkill != null){
        actor.nowSkill.setStep(3);
        actor.nowSkill.update();
        actor.nowSkill = null;
    }
    actor.nowSkill = this;

    /**
     * 伤害最终计算
     * @param ele 数据承载
     * @returns {*}
     */
    this.endHurt = function(ele){
        var damage = hurt;
        var attributeNum = {atk : 1,def:0};
        if(isSelf){
            if(ele !== RV.GameData.actor){
                attributeNum = RV.GameData.actor.getAttribute(ele.getData().attributeId);
            }
        }else{
            attributeNum = user.getAttribute();
        }
        if(damage > 0){
            damage *= ((999 - (ele.getMDef() / 2)) / 999);
            damage = Math.max(1,damage) * attributeNum.atk - Math.max(1,damage) * attributeNum.def;
        }else if(damage < 0){
        }else{
            damage = 0;
        }

        var d1 = damage * ((100 - cof.dispersed) / 100);
        var d2 = damage * ((100 + cof.dispersed) / 100);
        return rand(Math.floor(d1),Math.ceil(d2));
    };

    /**
     * 主刷新
     */
    this.update = function(){
        if(step === 0 && chantAction && chantAnim){
            stepPrepare();
        }else if(step == 1 && cof.userType == 2){//准备阶段
            stepWait += 1;
            if(stepWait > 999){
                log("技能准备阶段长时间未执行，请检查资源角色对应动作中，是否未设置出弹口");
                step = 2;
                stepWait = 0;
            }
        }else if(step === 2){//执行阶段循环
            if(overMove && overAnim){
                step = 3;
            }
            if(cof.selectRect && !selecting && cof.userType >= 3){
                selectime -= 1;
                if(selectime <= 0){
                    selecting = true;
                    userRect = rectSprite.GetRect();
                    rectSprite.fadeTo(0,20);
                }
                if(rectSprite != null){
                    if(isSelf){
                        if(IInput.isKeyPress(RC.Key.left)){
                            rectSprite.x -= 5;
                        }
                        if(IInput.isKeyPress(RC.Key.right)){
                            rectSprite.x += 5;
                        }
                        if(IInput.isKeyPress(RC.Key.up)){
                            rectSprite.y -= 5;
                        }
                        if(IInput.isKeyPress(RC.Key.down)){
                            rectSprite.y += 5;
                        }
                    }else{
                        if(rectSprite.x > RV.NowMap.getActor().getCharacter().x){
                            rectSprite.x -= 5;
                        }
                        if(rectSprite.x < RV.NowMap.getActor().getCharacter().x){
                            rectSprite.x += 3;
                        }
                        if(rectSprite.y > RV.NowMap.getActor().getCharacter().y){
                            rectSprite.y -= 3;
                        }
                        if(rectSprite.y < RV.NowMap.getActor().getCharacter().y){
                            rectSprite.y += 3;
                        }
                    }

                }
                return;
            }
            if(cof.userType === 1 && !doing ){//我方角色
                userSkill(actor , user);
                RV.NowCanvas.playAnim(cof.triggerAnim , function(){
                    overAnim = true;
                } , actor , true);
                doing = true;
            }else if(cof.userType === 2){//投射物

                if(throwTimes > 0){
                    if(throwInterval > 0){
                        throwInterval -= 1;
                    }
                }else{
                    overAnim = true;
                }
            }else if( cof.userType === 3  && !doing ){//区域最近敌人
                var camp = actor.camp == 1 ? 2 : 1;
                var needActor = actor.camp == 1;
                var tempEnemy = getNeedEnemys(0,camp , needActor , false);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                if(tempEnemy != null){
                    doSkill(tempEnemy);
                }else{
                    overAnim = true;
                }
                doing = true;
            }else if( cof.userType === 4 && !doing ){//区域随机
                camp = actor.camp == 1 ? 2 : 1;
                needActor = actor.camp == 1;
                tempEnemy = getNeedEnemys(1,camp , needActor , false);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                if(tempEnemy != null){
                    doSkill(tempEnemy);
                }else{
                    overAnim = true;
                }
                doing = true;
            }else if(cof.userType === 5 && !doing ){//区域全部
                camp = actor.camp == 1 ? 2 : 1;
                needActor = actor.camp == 1;
                var tempEnemys = getNeedEnemys(2,camp , needActor , false);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                for(var i = 0;i<tempEnemys.length;i++){
                    tempEnemy = tempEnemys[i];
                    if(tempEnemy != null){
                        doSkill(tempEnemy);
                    }
                }
                if(tempEnemys.length <= 0){
                    overAnim = true;
                }
                doing = true;
            }else if( cof.userType === 6  && !doing ){//区域最近友军
                camp = actor.camp == 1 ? 1 : 2;
                needActor = actor.camp == 2 || actor.camp == 0;
                tempEnemy = getNeedEnemys(0,camp , needActor , false);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                if(tempEnemy != null){
                    doSkill(tempEnemy);
                }else{
                    doSkill(actor);
                }
                doing = true;
            }else if( cof.userType === 7 && !doing ){//区域随机友军
                camp = actor.camp == 1 ? 1 : 2;
                needActor = actor.camp == 2 || actor.camp == 0;
                tempEnemy = getNeedEnemys(1,camp , needActor , true);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                if(tempEnemy != null){
                    doSkill(tempEnemy);
                }else{
                    overAnim = true;
                }
                doing = true;
            }else if(cof.userType === 8 && !doing ){//区域全部
                camp = actor.camp == 2 ? 2 : 1;
                needActor = actor.camp == 2;
                tempEnemys = getNeedEnemys(2,camp , needActor , true);
                RV.NowCanvas.playAnim(cof.rectAnim,function(){},null,true,userRect);
                for(i = 0;i<tempEnemys.length;i++){
                    tempEnemy = tempEnemys[i];
                    if(tempEnemy != null){
                        doSkill(tempEnemy);
                    }
                }
                if(tempEnemys.length <= 0){
                    overAnim = true;
                }
                doing = true;
            }

            if(nowMoveTime <= 0){
                overMove = true;
                doing = true;
            }else{
                if(actor.getDir() == 0 || actor.getDir() == 4 || actor.getDir() == 5){
                    actor.Speed[1] = cof.moveY;
                    actor.Speed[0] = cof.moveX;
                }else if(actor.getDir() == 1){
                    actor.Speed[1] = -cof.moveX;
                    actor.Speed[0] = cof.moveY;
                }else if(actor.getDir() == 2){
                    actor.Speed[1] = cof.moveX;
                    actor.Speed[0] = cof.moveY;
                }else if(actor.getDir() == 3 || actor.getDir() == 6 || actor.getDir() == 7){
                    actor.Speed[1] = cof.moveY;
                    actor.Speed[0] = -cof.moveX;
                }

                if(nowMoveTime % cof.launchInterval == 0){
                    doing = false;
                }
                updateUserRect();
                nowMoveTime -= 1;
            }

        }else if(step === 3){//结束阶段
            char.fixedOrientation = oldFixedOrientation;
            actor.actionLock = false;
            actor.skillChant = false;
            actor.getCharacter().reSingleTime();
            actor.superArmor = false;
            actor.nowSkill = null;
            char.shootCall = null;
            if(this.endDo != null){
                this.endDo();
                this.dispose();
            }
        }
    };

    /**
     * 执行技能
     * @param enemy
     */
    function doSkill(enemy){
        if(enemy instanceof LEnemy){
            userSkill(enemy.getActor() , enemy);
            RV.NowCanvas.playAnim(cof.triggerAnim , function(){
                overAnim = true;
            } , enemy.getActor() , true);
        }else if(enemy instanceof LActor){
            userSkill(enemy , RV.GameData.actor);
            RV.NowCanvas.playAnim(cof.triggerAnim , function(){
                overAnim = true;
            } , enemy , true);
        }

    }

    /**
     * 获得对应条件的敌人或角色
     * @param type 筛选类型 0为区域最近 1为区域随机 2为区域全部
     * @param camp 筛选敌人阵营
     * @param needActor 是否需要角色参与筛选
     * @param needSelf 是否筛选自己
     * @returns {*}
     */
    function getNeedEnemys(type,camp,needActor,needSelf){
        var tempEnemy = null;
        var tempEnemys = [];
        var enemys = RV.NowMap.getEnemys();
        var dis = 999999;
        for(var i = 0;i<enemys.length;i++){
            if(!needSelf && enemys[i] == user){
                continue;
            }
            var tempRect = enemys[i].getActor().getValidRect();
            //怪物在范围内
            if(enemys[i].getActor().camp == camp &&!enemys[i].isDie && enemys[i].visible && userRect.intersects(tempRect)){
                if(type == 0){
                    //计算两点间距离
                    var tempDis = Math.abs( Math.sqrt( Math.pow((char.x - tempRect.centerX),2) + Math.pow((char.y - tempRect.centerY),2) ) );
                    if(tempDis < dis){
                        dis = tempDis;
                        tempEnemy = RV.NowMap.getEnemys()[i];
                    }
                }else{
                    //怪物在范围内
                    if(enemys[i].getActor().camp == camp &&!enemys[i].isDie && enemys[i].visible && userRect.intersects(tempRect)){
                        tempEnemys.push(RV.NowMap.getEnemys()[i]);
                    }
                }

            }
        }

        if(needActor){
            tempRect = RV.NowMap.getActor().getValidRect();
            if(type == 0 && userRect.intersects(tempRect)){
                tempDis = Math.abs( Math.sqrt( Math.pow((char.x - tempRect.centerX),2) + Math.pow((char.y - tempRect.centerY),2) ) );
                if(tempDis < dis){
                    tempEnemy = RV.NowMap.getActor();
                }
            }else{
                tempRect = RV.NowMap.getActor().getValidRect();
                if(userRect.intersects(tempRect)){
                    tempEnemys.push(RV.NowMap.getActor());
                }
            }
        }

        if(type == 0){
            return tempEnemy;
        }else if(type == 1){
            return RF.RandomChoose(tempEnemys);
        }else if(type == 2){
            return tempEnemys;
        }
    }

    /**
     * 处理技能效果与数值
     * @param cactor 承载角色LActor对象
     * @param user 实际数据承载GActor / LEnemy
     */
    function userSkill(cactor,user){
        handleHPMP(cactor , _sf.endHurt(user)  , 0);

        //还要加BUFF
        for(var id in cof.cState){
            if(cof.cState[id] === 1){
                user.addBuff(id);
            }else if(cof.cState[id] === 2){
                user.subBuff(id);
            }
        }
    }

    /**
     * 生成伤害处理结果
     * @param actor 触发actor
     * @param addHp hp伤害数据
     * @param addMp mp伤害数据
     */
    function handleHPMP(oactor,addHp,addMp){
        if(addHp == 0 && addMp == 0) return;
        if(addMp != 0){
            oactor.injure(4 , addMp * -1);
        }
        if(addHp != 0){
            var obj = {
                crit : false,
                damage : addHp,
                repel : cof.repel,
                dir : actor.getDir(),
                fly : cof.fly
            };
            oactor.injure(2, obj);
        }
    }

    /**
     * 获得子弹发射对象
     * @returns {{repel: *, fly: (*|number), dir: number}}
     */
    this.getBulletObj = function(){
        return {
            repel : cof.repel,
            dir : actor.getDir(),
            fly : cof.fly
        }
    };
    /**
     * 释放
     */
    this.dispose = function(){
        if(rectSprite != null){
            rectSprite.dispose();
        }
    };

    //吟唱阶段
    function stepChant(){
        step = 0;
        actor.skillChant = true;
        char.setAction(cof.readyAction , false , true , false);
        char.actionCall = function(){
            char.actionCall = null;
            char.reSingleTime();
            chantAction = true;
        };
        if(cof.readyAction === 0){
            chantAction = true;
        }
        RV.NowCanvas.playAnim(cof.userAnim , function(){
            chantAnim = true;
        } , actor,true);
    }

    function updateUserRect(){
        //设置技能范围
        var x = char.x;
        var y = char.y;
        var dir = actor.getDir();
        if(dir == 0 || dir == 4 || dir == 5){
            userRect.x = x + cof.triggerY *RV.NowProject.blockSize;
            userRect.y = y + cof.triggerX * RV.NowProject.blockSize;
            userRect.width = cof.triggerHeight * RV.NowProject.blockSize;
            userRect.height = cof.triggerWidth * RV.NowProject.blockSize;
        }else if(dir == 1){
            userRect.x = x - ((cof.triggerX + cof.triggerWidth - 1) *RV.NowProject.blockSize);
            userRect.y = y + cof.triggerY * RV.NowProject.blockSize;
            userRect.width = cof.triggerWidth * RV.NowProject.blockSize;
            userRect.height = cof.triggerHeight * RV.NowProject.blockSize;
        }else if(dir == 2){
            userRect.x = x + cof.triggerX * RV.NowProject.blockSize;
            userRect.y = y + cof.triggerY * RV.NowProject.blockSize;
            userRect.width = cof.triggerWidth * RV.NowProject.blockSize;
            userRect.height = cof.triggerHeight * RV.NowProject.blockSize;
        }else if(dir == 3 || dir == 6 || dir == 7){
            userRect.x = x - ((cof.triggerY + cof.triggerHeight - 1) *RV.NowProject.blockSize);
            userRect.y = y - ((cof.triggerX + cof.triggerWidth - 1) *RV.NowProject.blockSize);
            userRect.width = cof.triggerHeight * RV.NowProject.blockSize;
            userRect.height = cof.triggerWidth * RV.NowProject.blockSize;
        }
    }

    //准备阶段
    function stepPrepare(){
        step = 1;
        //执行公共事件
        var trigger = RV.NowSet.findEventId(cof.eventId);
        if(trigger != null){
            trigger.doEvent();
        }
        //锁定方向
        if(cof.lockDirection){
            oldFixedOrientation = char.fixedOrientation;
            char.fixedOrientation = true;
        }
        //霸体
        if(cof.superArmor){
            actor.superArmor = true;
        }
        updateUserRect();
        if(cof.selectRect && cof.userType >= 3 ){
            rectSprite = new ISprite(IBitmap.CBitmap(parseInt(userRect.width) , parseInt(userRect.height)),RV.NowMap.getView());
            if(isSelf){
                rectSprite.drawRect(new IRect(0,0,rectSprite.width,rectSprite.height),new IColor(255,125,125,125));
            }else{
                rectSprite.drawRect(new IRect(0,0,rectSprite.width,rectSprite.height),new IColor(125,255,125,125));
            }

            actor.stiffTime = selectime;

            rectSprite.z = 500;
            rectSprite.x = userRect.x;
            rectSprite.y = userRect.y;
        }
        //设置移动动作
        actor.actionLock = true;
        if(cof.doAction !== 0){

            if(cof.userType == 2){
                char.shootCall = function(points){
                    if(throwInterval > 0) return;
                    for(var i = 0;i<points.length;i++){
                        var p = char.getCenterPoint();
                        var x = p[0] + points[i].x;
                        var y = p[1] + points[i].y;
                        RV.NowCanvas.playBullet(cof.bullet , actor , x , y , {value1:100 , value2:0, buff:cof.cState , skill : _sf});
                    }
                    throwInterval = cof.launchInterval;
                    throwTimes -= 1;
                    if(throwTimes <= 0) char.shootCall = null;
                };
            }

            char.setAction(cof.doAction , false , cof.userType != 2 , false , true);
        }
        //进入执行阶段
        step = 2;
        actor.skillChant = false;
    }

    this.setStep = function(index){
        step = index;
    };

    this.stopSkill = function(){
        if(cof.superArmor) return false;
        //吟唱可以随时中断
        if(step < 2){
            step = 3;
        }else if(step == 2){
            if(!cof.superArmor){
                step = 3;
            }
        }
        return true;
    }
}/**
 * Created by 七夕小雨 on 2019/3/17.
 * 触发器运行逻辑
 * @param trigger 触发器数据
 * @param view 敌人承载视窗
 * @param mdata 地图基础图块
 * @param blocks 交互块
 * @param mapdata 地图数据
 */
function LTrigger(trigger , view , mdata , blocks , mapdata){

    var _sf = this;

    var data = trigger;
    this.id = trigger.id;
    this.name = trigger.name;
    this.entity = false;
    var char = null;

    var pageIndex = -1;
    var tempPageIndex = -1;
    var nowPage = null;

    var doEnd = false;

    var rect = null;

    var icon = new ISprite(RF.LoadCache("System/icon_event.png"),view);
    var keyStr = RC.CodeToSting(RC.Key.ok);
    if(IsPC()){
        icon.drawTextQ(keyStr , (icon.width - IFont.getWidth(keyStr,14)) / 2 ,7,IColor.Black(),14);
    }else{
        icon.drawTextQ("触摸" , (icon.width - IFont.getWidth(keyStr,12)) / 2 ,7,IColor.Black(),12);
    }

    icon.visible = false;

    this.getSwitch = function(index){
        if(RV.GameData.selfSwitch[RV.NowMap.id] == null){
            return false;
        }
        if(RV.GameData.selfSwitch[RV.NowMap.id][_sf.id] == null){
            return false;
        }
        return RV.GameData.selfSwitch[RV.NowMap.id][_sf.id][index];
    }

    inspectPage();

    /**
     * 主循环
     */
    this.update = function(){
        if(char != null) {
            char.update();
            _sf.updateIconPoint();
        }
        inspectPage();
        doTrigger();
    };

    /**
     * 刷新Icon位置
     */
    this.updateIconPoint = function(){
        var nowRect = null;
        if(char != null){
            nowRect = char.getCharacter().getSpirte().GetRect();
        }else{
            nowRect = rect;
        }
        icon.x = nowRect.left + (nowRect.width - icon.width) / 2;
        icon.y = nowRect.top - icon.height + 5;
    };

    /**
     * 释放
     */
    this.dispose = function(){
        if(char != null) char.dispose();
        icon.disposeMin();
    };

    /**
     * 获得LActor
     * @returns {*}
     */
    this.getCharacter = function(){
        return char;
    };
    /**
     * 获得判定矩形
     * @returns {*}
     */
    this.getRect = function(){
        return rect;
    };

    /**
     * 获得事件朝向
     */
    this.getDir = function(){
        return char.getDir();
    };

    /**
     * 执行触发器内容
     */
    function doTrigger(){
        if(nowPage == null) return;
        var nowRect = rect;
        //if(char != null){
        //    nowRect = char.getCharacter().getSpirte().GetRect();
        //}
        if(nowPage.type == 0 && !doEnd){//执行事件
            addTrigger();
        }else if(nowPage.type == 1 && !doEnd && nowRect != null && RV.NowMap.getActor().getCharacter().isContactFortRect(nowRect)){
            addTrigger();
        }else if(nowPage.type == 2 && !doEnd  && nowRect != null && RV.NowMap.getActor().getCharacter().isContactFortRect(nowRect) && isTowardsMe()){
            icon.visible = true;
            IVal.scene.getMainUI().setPhoneButton(true);
            if( IInput.isKeyDown(RC.Key.ok) || IVal.scene.getMainUI().nextClick){
                //面朝角色
                if(char != null){
                    var character = char.getCharacter();
                    var dx = character.x - RV.NowMap.getActor().getCharacter().x;
                    var dy = character.y - RV.NowMap.getActor().getCharacter().y;
                    if(Math.abs(dx) > Math.abs(dy)){
                        if(dx > 0){
                            character.setDir(1);
                        }else{
                            character.setDir(2);
                        }
                    }else{
                        if(dy > 0){
                            character.setDir(3);
                        }else{
                            character.setDir(0);
                        }
                    }
                    addTrigger();
                }else{
                    addTrigger();
                }
                IVal.scene.getMainUI().nextClick = false;
            }
        }else{
            icon.visible = false;
        }
    }

    function isTowardsMe(){
        if(rect == null) return false;
        if(char == null) return true;
        var dx = RV.NowMap.getActor().getCharacter().x - char.getCharacter().x;
        var dy = RV.NowMap.getActor().getCharacter().y - char.getCharacter().y;
        if(Math.abs(dx) > Math.abs(dy)){//左右
            if(dx >= 0 && (RV.NowMap.getActor().getDir() == 1 || RV.NowMap.getActor().getDir() == 4 || RV.NowMap.getActor().getDir() == 6)) return true;
            if(dx <= 0 && (RV.NowMap.getActor().getDir() == 2 || RV.NowMap.getActor().getDir() == 5 || RV.NowMap.getActor().getDir() == 7)) return true;
        }else{//上下
            if(dy <= 0 && (RV.NowMap.getActor().getDir() == 0 || RV.NowMap.getActor().getDir() == 4 || RV.NowMap.getActor().getDir() == 5)) return true;
            if(dy >= 0 && (RV.NowMap.getActor().getDir() == 3 || RV.NowMap.getActor().getDir() == 6 || RV.NowMap.getActor().getDir() == 7)) return true;

        }
        return false;
    }

    /**
     * 实际执行
     */
    function addTrigger(){
        RV.NowEventId = _sf.id;
        if(nowPage.isParallel && RF.FindOtherEvent(_sf) == null ){
            RF.AddOtherEvent(nowPage.events,_sf,_sf.id);
            doEnd = !nowPage.loop;
        }else if(!nowPage.isParallel && RV.InterpreterMain.isEnd){
            RV.InterpreterMain.addEvents(nowPage.events);
            RV.InterpreterMain.NowEventId = _sf.id;
            doEnd = !nowPage.loop;
        }
    }

    /**
     * 检测当前可以执行的触发页
     */
    function inspectPage(){
        for(var i = data.page.length - 1;i >= 0;i--){
            if(data.page[i].logic.tag == null){
                data.page[i].logic.tag = _sf;
            }
            if(i != tempPageIndex && data.page[i].logic.result()){
                pageIndex = i;
                tempPageIndex = pageIndex;
                repaintPage();
                return;
            }
            if(i == tempPageIndex && data.page[i].logic.result()){
                return;
            }
        }
        if(char != null){
            char.dispose();
            char = null;
        }
        tempPageIndex = -1;
        nowPage = null;
        rect = null;
    }

    /**
     * 刷新触发页
     */
    function repaintPage(){

        nowPage = data.page[pageIndex];
        var oldX = data.x * RV.NowProject.blockSize;
        var oldY = data.y * RV.NowProject.blockSize;
        if(char != null){
            oldX = char.getCharacter().x;
            oldY = char.getCharacter().y;
            char.dispose();
            char = null;
        }else if(rect != null){
            oldX = rect.x;
            oldY = rect.y;
        }
        var image = nowPage.image;
        if(image.id != -1){
            char = new LActor(view , 0 , 0 , mdata , blocks , oldX, oldY, image.id,180);
            var character = char.getCharacter();
            character.CanPenetrate = nowPage.penetration == 0;
            character.setDir(image.dir);
            character.setAction(image.actionIndex);
            character.fixedOrientation = image.fixedOrientation;
            char.actionLock = image.fixedAction;
            character.getSpirte().opacity = image.opacity / 255;
            rect = character.getCharactersRect();
            _sf.entity = image.entity;
        }else{
            rect = new IRect(oldX,oldY,oldX + RV.NowProject.blockSize,oldY + RV.NowProject.blockSize);
        }

        icon.x = rect.left + (rect.width - icon.width) / 2;
        if(character == null){
            icon.y = rect.top - icon.height + 5;
        }else{
            icon.y = character.getSpirte().y - icon.height + 5;
        }
        icon.z = 13000;

        doEnd = false;
    }

    this.updateGravityNum = function(){
        if(char == null) return;
        char.GravityNum = (RV.GameData.gravityNum / 100) * mapdata.gravity;
        char.Speed[0] = 0;
    };

    this.getUserRect = function(){
        if(char != null){
            return char.getUserRect();
        }else if(rect != null){
            return rect;
        }else{
            return new IRect(data.x * RV.NowProject.blockSize,data.y * RV.NowProject.blockSize,
                data.x * RV.NowProject.blockSize + RV.NowProject.blockSize,
                data.y * RV.NowProject.blockSize + RV.NowProject.blockSize);
        }
    };

    this.save = function(){
        var gravity = false;
        var actionLock = false;
        var fixedOrientation = false;
        var dir = 0;
        var opacity = 1;
        var CanPenetrate = false;
        var x = data.x * RV.NowProject.blockSize;
        var y = data.y * RV.NowProject.blockSize;
        var end = doEnd;
        if(char != null){
            gravity = char.IsGravity;
            actionLock = char.actionLock;
            dir = char.getDir();
            var chars = char.getCharacter();
            if(chars != null){
                fixedOrientation = chars.fixedOrientation;
                CanPenetrate = chars.CanPenetrate;
                if(chars.getSpirte() != null){
                    opacity = chars.getSpirte().opacity;
                }
                x = chars.x;
                y = chars.y;
            }
        }else{
            if(rect != null){
                x = rect.x;
                y = rect.y;
            }
        }


        return {
            x:x,
            y:y,
            gravity : gravity,
            actionLock : actionLock,
            fixedOrientation : fixedOrientation,
            CanPenetrate:CanPenetrate,
            dir : dir,
            opacity : opacity,
            end: end
        }

    };

    this.load = function(info){

        if(char != null){
            var chars = char.getCharacter();
            if(chars != null){
                chars.x = info.x;
                chars.y = info.y;
                chars.fixedOrientation = info.fixedOrientation;
                chars.CanPenetrate = info.CanPenetrate;
                chars.setDir(info.dir);
                if(chars.getSpirte()){
                    chars.getSpirte().opacity = info.opacity;
                }
            }
            char.IsGravity = info.gravity;
            char.actionLock = info.actionLock;

        }else{
            if(rect != null){
                rect.x = info.x;
                rect.y = info.y;
            }
        }
        doEnd = info.end;
    };

    this.setSwitch = function(index,sw){
        if(RV.GameData.selfSwitch[RV.NowMap.id] == null){
            RV.GameData.selfSwitch[RV.NowMap.id] = [];
        }
        if(RV.GameData.selfSwitch[RV.NowMap.id][_sf.id] == null){
            RV.GameData.selfSwitch[RV.NowMap.id][_sf.id] = [false,false,false,false,false,false,false,false,false];
        }
        RV.GameData.selfSwitch[RV.NowMap.id][_sf.id][index] = sw;
    };





}/**
 * Created by 七夕小雨 on 2018-2-26.
 * 天气处理
 */
function LWeather(){
    //天气类型
    var type;
    //当前天气图片
    var bitmap;
    //天气粒子
    var particle;
    var rb,sb,pb,lb;
    var null_bitmap;
    var petal;

    bitmap = null;
    type = 0;
    null_bitmap = IBitmap.CBitmap(10, 10);

    /**
     * 初始化雨的图片
     */
    function rain_init(){
        rb = [RF.LoadBitmap("System/Weather/rain.png")];
    }

    /**
     * 初始化雪的图片
     */
    function snow_init(){
        sb =[RF.LoadBitmap("System/Weather/snow.png")];
    }

    /**
     * 花瓣
     */
    function petal_init(){
        pb = [
            RF.LoadBitmap("System/Weather/petal_0.png"),
            RF.LoadBitmap("System/Weather/petal_1.png"),
            RF.LoadBitmap("System/Weather/petal_2.png")];
    }

    /**
     * 落叶
     */
    function leaf_init(){
        lb =[RF.LoadBitmap("System/Weather/leaf.png")];
    }

    /**
     * 设置天气
     * @param ptype
     */
    this.setWeatherType = function(ptype){
        var max = 10;
        var time =60;
        type = ptype;
        if(type<=0 || type>4){
            type = 0;
            bitmap = null;
            if(petal != null){
                petal.dispose();
            }
            particle.changeParticle([null_bitmap], 0, 1, 0, null);
        }else{
            if(type == 1){
                max = 60;
                time = 60;
                particle.dir = 1;
                particle.line = RV.NowProject.gameHeight;
                bitmap = rb;
            }else if(type == 2){
                bitmap = sb;
                max = 20;
                time = 120;
                particle.line = RV.NowProject.gameHeight;
                particle.dir = 1;
            }else if(type == 3){
                bitmap = null;
                if(petal != null){
                    petal.dispose();
                }
                petal = new LPetal(pb , 20, 1050, null);
            }else if(type == 4){
                bitmap = null;
                if(petal != null){
                    petal.dispose();
                }
                petal = new LPetal(lb , 20, 1050, null);
            }else{
                bitmap = null;
            }
            if(bitmap != null){
                if(petal != null){
                    petal.dispose();
                }
                particle.changeParticle(bitmap, max, time, 0, null);
                particle.z = 1050;
            }else{
                particle.changeParticle([null_bitmap], 0, 1, 0, null);
            }

        }
    };

    /**
     * 天气对象初始化
     */
    this.init = function() {
        petal_init();
        leaf_init();
        snow_init();
        rain_init();
        particle  = new IParticle([null_bitmap], 0, 1, 0, null);
        particle.rect = new IRect(0, 0, RV.NowProject.gameWidth, RV.NowProject.gameHeight);
        particle.z = 1050;
    };

    /**
     * 主循环
     */
    this.update = function() {
        if(type >= 0){
            if(particle != null){
                particle.update();
            }
            if(petal != null){
                petal.update();
            }
        }
    };

    /**
     * 释放
     */
    this.dispose = function() {
        if(particle != null){
            null_bitmap = null;
            rb = null;
            sb = null;
            lb = null;
            particle.dispose();
            particle = null;
        }
        if(petal != null){
            petal.dispose();
        }
    }

}/**
 * Created by 七夕小雨 on 2019/3/17.
 * 通用控制部分
 */
function RC(){}

//默认按键配置
RC.Key = {
    up        : 87,
    down      : 83,
    left      : 65,
    right     : 68,
    jump      : 74,
    run       : 75,
    atk       : 76,
    ok        : 13,
    cancel    : 27,
    item1     :49,
    item2      :50,
    item3      :51,
    item4      :52,
    item5       :0,
    item6       :0,
    item7       :0,
    item8       :0,
    item9       :0,
    item10       :0,
    skill1     :89,
    skill2     :85,
    skill3     :73,
    skill4     :79,
    skill5      :80,
    skill6      :0,
    skill7      :0,
    skill8      :0,
    skill9      :0,
    skill10      :0
};

/**
 * 游戏按键初始化
 */
RC.KeyInit = function(){
    var keys = RV.NowSet.setAll.key;
    var keys2 = RV.NowSet.setAll.key2;
    RC.Key.up = keys[0];
    RC.Key.down = keys[1];
    RC.Key.left = keys[2];
    RC.Key.right = keys[3];
    RC.Key.jump = keys[4];
    RC.Key.run = keys[5];
    RC.Key.atk = keys[6];
    RC.Key.ok = keys[7];
    RC.Key.cancel = keys[8];
    RC.Key.item1 = keys[9];
    RC.Key.item2 = keys[10];
    RC.Key.item3 = keys[11];
    RC.Key.item4 = keys[12];
    RC.Key.item5 = keys2[0];
    RC.Key.item6 = keys2[1];
    RC.Key.item7 = keys2[2];
    RC.Key.item8 = keys2[3];
    RC.Key.item9 = keys2[4];
    RC.Key.item10 = keys2[5];
    RC.Key.skill1 = keys[13];
    RC.Key.skill2 = keys[14];
    RC.Key.skill3 = keys[15];
    RC.Key.skill4 = keys[16];
    RC.Key.skill5 = keys[17];
    RC.Key.skill6 = keys2[6];
    RC.Key.skill7 = keys2[7];
    RC.Key.skill8 = keys2[8];
    RC.Key.skill9 = keys2[9];
    RC.Key.skill10 = keys2[10];

};
/**
 * 输入按键code获得对应字符串
 * @param code
 * @returns string
 */
RC.CodeToSting = function(code) {
    switch (code) {
        case 8:
            return "Back";
        case 9:
            return "Tab";
        case 12:
            return "Clear";
        case 13:
            return "Ent";
        case 16:
            return "Shift";
        case 17:
            return "Ctrl";
        case 18:
            return "Alt";
        case 19:
            return "Pause";
        case 20:
            return "Caps";
        case 27:
            return "Esc";
        case 32:
            return "Space";
        case 33:
            return "Prior";
        case 34:
            return "Next";
        case 35:
            return "End";
        case 36:
            return "Home";
        case 37:
            return "Left";
        case 38:
            return "Up";
        case 39:
            return "Right";
        case 40:
            return "Down";
        case 41:
            return "Select";
        case 42:
            return "Print";
        case 43:
            return "Execute";
        case 45:
            return "Ins";
        case 46:
            return "Del";
        case 47:
            return "Help";
        case 48:
            return "0";
        case 49:
            return "1";
        case 50:
            return "2";
        case 51:
            return "3";
        case 52:
            return "4";
        case 53:
            return "5";
        case 54:
            return "6";
        case 55:
            return "7";
        case 56:
            return "8";
        case 57:
            return "9";
        case 65:
            return "A";
        case 66:
            return "B";
        case 67:
            return "C";
        case 68:
            return "D";
        case 69:
            return "E";
        case 70:
            return "F";
        case 71:
            return "G";
        case 72:
            return "H";
        case 73:
            return "I";
        case 74:
            return "J";
        case 75:
            return "K";
        case 76:
            return "L";
        case 77:
            return "M";
        case 78:
            return "N";
        case 79:
            return "O";
        case 80:
            return "P";
        case 81:
            return "Q";
        case 82:
            return "R";
        case 83:
            return "S";
        case 84:
            return "T";
        case 85:
            return "U";
        case 86:
            return "V";
        case 87:
            return "W";
        case 88:
            return "X";
        case 89:
            return "Y";
        case 90:
            return "Z";
        case 96:
            return "Kp0";
        case 97:
            return "Kp1";
        case 98:
            return "Kp2";
        case 99:
            return "Kp3";
        case 100:
            return "Kp4";
        case 101:
            return "Kp5";
        case 102:
            return "Kp6";
        case 103:
            return "Kp7";
        case 104:
            return "Kp8";
        case 105:
            return "Kp9";
        case 106:
            return "Kp*";
        case 107:
            return "Kp+";
        case 108:
            return "KpEnt";
        case 109:
            return "Kp-";
        case 110:
            return "Kp.";
        case 111:
            return "Kp/";
        case 112:
            return "F1";
        case 113:
            return "F2";
        case 114:
            return "F3";
        case 115:
            return "F4";
        case 116:
            return "F5";
        case 117:
            return "F6";
        case 118:
            return "F7";
        case 119:
            return "F8";
        case 120:
            return "F9";
        case 121:
            return "F10";
        case 122:
            return "F11";
        case 123:
            return "F12";
        case 187:
            return "+";
        case 189:
            return "_";
        case 219:
            return "{";
        case 221:
            return "}";
        case 220:
            return "\\";
        case 186:
            return ";";
        case 222:
            return "\"";
        case 188:
            return "<";
        case 190:
            return ">";
        case 191:
            return "/";
        case 192:
            return "~";
        default:
            return "无效";
    }
};/**
 * Created by 七夕小雨 on 2019/1/3.
 * 通用函数
 */
function RF(){}

/**
 * 游戏结束
 */
RF.GameOver = function(){
    if(IVal.scene instanceof SMain){
        var ui =  RV.NowUI.uis[9];
        IVal.scene.initSelfUI(ui,"");
    }
};
/**
 * 游戏胜利
 */
RF.GameWin = function(){
    if(IVal.scene instanceof  SMain){
        var ui =  RV.NowUI.uis[10];
        IVal.scene.initSelfUI(ui,"");
    }
};
/**
 * 游戏菜单
 */
RF.GameMenu = function(){
    if(IVal.scene instanceof SMain){
        IVal.scene.setDialog(new WMenu(),
            function(menu){
                if(menu == "loadGame"){
                    RF.LoadGame();
                }else if(menu == "backTitle"){
                    IVal.scene.dispose();
                    IAudio.BGMFade(2);
                    IAudio.BGSFade(2);
                    IVal.scene = new STitle();
                }
            });
    }
};
/**
 * 读取图片
 * @param path 图片地址
 */
RF.LoadBitmap = function(path){
    return IBitmap.WBitmap("Graphics/" + path);
};

/**
 * 读取缓存
 * @param path 图片地址
 * @param func 读取完毕后回调
 * @param tag 读取过程中tag
 * @returns {*} 缓存中图片
 */
RF.LoadCache = function(path,func,tag){
    if(RV.Cache[path] == null){
        RV.Cache[path] = RF.LoadBitmap(path);
        RV.Cache[path].loadTexture();
        if(RV.Cache[path].complete){
            if(func != null) func(RV.Cache[path],tag)
        }else if(func != null){
            RV.Cache[path].onload = function(){
                func(RV.Cache[path],tag);
            };
            RV.Cache[path].onerror = function(){
                func(null,tag);
            };
        }
        return RV.Cache[path];
    }else{
        if(func != null){
            if(func != null) func(RV.Cache[path],tag);
        }
        return RV.Cache[path];
    }
};


/**
 * 预加载UI资源
 * @param fileAry 文件数组
 * @param loadOver 加载完毕后回调 function(ary)
 */
RF.CacheUIRes = function(fileAry,loadOver){
    var index = 0;
    var hash = {};
    if(fileAry.length == 0){
        loadOver([]);
        return;
    }
    for(var i = 0;i<fileAry.length;i++){
        var bitmap = RF.LoadBitmap(fileAry[i]);
        hash[fileAry[i]] = bitmap;
    }
    for(var key in hash){
        bitmap = hash[key];
        if(bitmap.complete){
            index += 1;
            if(index >= Object.keys(hash).length){
                loadOver(hash)
            }
        }else{
            bitmap.onload = function(){
                index += 1;
                if(index >= Object.keys(hash).length){
                    loadOver(hash)
                }
            };
            bitmap.onerror = function(){
                index += 1;
                if(index >= Object.keys(hash).length){
                    loadOver(hash)
                }
            };
        }
    }
};


/**
 *获得时间数字
 * @param s
 * @returns {string}
 * @constructor
 */
RF.MakerTime = function(s){
    if(s >= 3600){
        return parseInt(s / 3600) + ":" + (parseInt(s / 60) % 60) + ":" + (s % 60);
    }else if(s >= 60){
        return parseInt(s / 60) + ":" + (s % 60);
    }else if(s >= 0){
        return "00"+":"+ s ;
    }
    else{
        s = 0;
        return "00"+":"+s;
    }
};
/**
 * 获得时间戳
 * @constructor
 */
RF.GetTime = function(){
    var time = Number(new Date());
    return parseInt(time / 1000);
};

/**
 * 绘制连续窗口
 * @param fbmp 目标Sprite
 * @param bmp  资源bitmap
 * @param w    窗口宽度
 * @param h    窗口高度
 * @param x    窗口x偏移
 * @param y    窗口y偏移
 * @param l    单位格尺寸（保证正方形）;
 */
RF.DrawFrame = function( fbmp, bmp,  w, h, x, y , l){
    var width = w;
    var height = h;

    var g = fbmp;

    var lt = l;

    //四个边
    g.drawBitmap(bmp[0], x, y);
    g.drawBitmap(bmp[2], x + width - lt, y);
    g.drawBitmap(bmp[5], x, y + height - lt);
    g.drawBitmap(bmp[7], x + width - lt, y + height - lt);
    //计算长宽
    width = width - lt - lt;
    height = height- lt - lt;

    g.drawBitmapRect(bmp[1], new IRect(x + lt,y, x + lt + width , y + lt),false);//上
    g.drawBitmapRect(bmp[3], new IRect(x,y + lt,x + lt,y + lt + height),false);//左
    g.drawBitmapRect(bmp[6], new IRect(x + lt, y + height + lt, x + lt + width,y + height + lt + lt),false);//下
    g.drawBitmapRect(bmp[4], new IRect(x + width + lt , y + lt,x + width + lt + lt,y + lt + height),false);//右
    g.drawBitmapRect(bmp[8], new IRect(x + lt,y + lt,x + lt +width,y + lt+height),false);//肚子

};

/**
 * 是否按下继续建
 * @returns {boolean}
 */
RF.IsNext = function(){
    return IInput.up || IInput.isKeyDown(RC.Key.atk) || IInput.isKeyDown(13) || IInput.isKeyDown(27) || IInput.isKeyDown(32);
};
/**
 * 默认颜色 0号
 * @returns {IColor}
 */
RF.C0 = function(){
    return IColor.White();
};

/**
 * 显示tips
 * @param m tips 内容
 */
RF.ShowTips = function(m){
    if(IVal.scene instanceof SMain == false) return;
    var main =IVal.scene.getMainUI();
    var back = main.tipBack;
    var text = main.tipText;
    LUI.setText(text,RF.MakerValueText(m));
    back.width = text.width + text.data.x * 2;
    back.height = text.height + text.data.y * 2;
    var r = LUI.getCtrlRect(back.data,main.ctrlItems,0,0);
    var r1 = back.GetRect();
    var endX = r.x + DUI.HPoint(back.data.x,back.data.HAlign, r.width, r1.width);
    var endY = r.y + DUI.VPoint(back.data.y,back.data.VAlign, r.height,r1.height);
    back.x = endX;
    back.y = endY;
    text.x = back.x + text.data.x;
    text.y = back.y + text.data.y;
    back.opacity = 1;
    text.opacity = 1;
    back.pauseAnim();
    text.pauseAnim();
    back.addAction(action.wait,60 + m.length * 4);
    back.addAction(action.fade,1,0,60);
    text.addAction(action.wait,60 + m.length * 4);
    text.addAction(action.fade,1,0,60);
};

/**
 * 关键字符串转译为“空”
 * @param str
 * @returns {String}
 */
RF.TextAnalysisNull = function(str){
    var s = new String(str);
    s = ISprite.toRegular(s);
    s = s.replaceAll("\\r\\n", "\\n");
    s = s.replaceAll("\\\\[Nn]", RF.CharToAScII(60000));
    s = s.replaceAll("\\\\[Cc]\\[([0-9]+,[0-9]+,[0-9]+)]", "");
    s = s.replaceAll("\\\\[Ss]\\[([0-9]+)]", "");
    s = s.replaceAll("\\\\[Pp]", "");
    s = s.replaceAll("\\\\[Ww]\\[([0-9]+)]", "");
    s = s.replaceAll("\\\\[Vv]\\[([a-zA-Z0-9-_]+)]","  ");
    s = s.replaceAll("\\\\cd", "");
    s = s.replaceAll("\\\\ck", "");
    s = s.replaceAll("\\\\=", "");
    s = s.replaceAll("\\\\>", "");
    s = s.replaceAll("\\\\~", "");
    s = s.replaceAll("\\\\\\|", "");
    return s;
};
/**
 * 字符串转译为关键编码
 * @param str
 * @returns {String}
 * @constructor
 */
RF.TextAnalysis = function(str){
    var s = new String(str);
    s = ISprite.toRegular(s);
    s = s.replaceAll("\\r\\n", "\\n");
    s = s.replaceAll("\\\\[Nn]", RF.CharToAScII(60000));
    s = s.replaceAll("\\\\[Cc]\\[([0-9]+,[0-9]+,[0-9]+)]",RF. CharToAScII(60001) + "[$1]");
    s = s.replaceAll("\\\\[Ss]\\[([0-9]+)]", RF.CharToAScII(60002) + "[$1]");
    s = s.replaceAll("\\\\[Pp]", RF.CharToAScII(60100));
    s = s.replaceAll("\\\\[Ww]\\[([0-9]+)]", RF.CharToAScII(60104) + "[$1]");
    s = s.replaceAll("\\\\[Vv]\\[([a-zA-Z0-9-_]+)]",RF.CharToAScII(60003) +"[$1]");
    s = s.replaceAll("\\\\>", RF.CharToAScII(60105));
    s = s.replaceAll("\\\\=", RF.CharToAScII(60106));
    s = s.replaceAll("\\\\~", RF.CharToAScII(60101));
    s = s.replaceAll("\\\\\\|", RF.CharToAScII(60103));
    return s;
};

/**
 * iFAction 坐标字符转译
 * @param win 窗口
 * @param self 要计算坐标的对象 //{#RF.js_m_7#}
 * @param value 字符串或固定值
 * @param xy x方向或y方向 //{#RF.js_m_7#}
 * @returns Number
 */
RF.PointTranslation = function(win,self,value,xy){
    if(typeof(value)=='string'){
        var tag = value.split("_");
        var obj = tag[0];
        var alignment = tag[1];
        var deviation =  parseInt(tag[2]);
        var val = 0;
        var val2 = 0;
        var vars = 0;
        if(obj == "scene"){
            if(xy == "x"){
                val = IVal.GWidth;
                vars = self.width;
            }else{
                val = IVal.GHeight;
                vars = self.height;
            }
        }else{
            try{
                if(xy == "x"){
                    val = win.getEval(obj + ".width");
                    val2 = win.getEval(obj + ".x");
                    vars = self.width;
                }else{
                    val = win.getEval(obj + ".height");
                    val2 = win.getEval(obj + ".y");
                    vars = self.height;
                }
            }catch(e){ return 0}

        }
        if(alignment == "left" || alignment == "top"){
            return val2 + deviation;
        }else if(alignment == "center"){
            return (val2 + (val - vars) / 2) + deviation;
        }else if(alignment == "right" || alignment == "bottom"){
            return (val2 + val - vars) + deviation;
        }

    }else{
        return value;
    }
};

/**
 * 角色对敌人的普通攻击计算
 * @param enemy 敌人
 * @param dir   方向
 * @returns Object
 */
RF.ActorAtkEnemy = function(enemy,dir){
    if(enemy.visible === false) return null;
    //获得基础值
    var temp1 = RV.GameData.actor.getWAtk() - enemy.getWDef();
    var attributeNum = RV.GameData.actor.getAttribute(enemy.getData().attributeId);
    //计算伤害
    var temp2 = Math.max(1,temp1) * attributeNum.atk - Math.max(1,temp1) * attributeNum.def;
    //离散
    var d1 = temp2 * 0.85;
    var d2 = temp2 * 1.15;
    var d = rand(Math.floor(d1),Math.ceil(d2));
    //暴击闪避运算
    var crit = false;
    //闪避率
    var luckNum1 = (enemy.getAddDodge() / 100) + Math.max( 0 , enemy.getSpeed() - RV.GameData.actor.getSpeed()) / (RV.GameData.actor.getSpeed() + enemy.getSpeed()) / 2;
    //暴击率
    var luckNum2 = ( RV.GameData.actor.getAddCrit() / 100) + Math.max( 0 , RV.GameData.actor.getLuck() - enemy.getLuck()) / (RV.GameData.actor.getLuck() + enemy.getLuck()) / 2;
    //计算闪避
    if(RF.ProbabilityHit(luckNum1) || d == 0){
        new LNum(3 , 0 , RV.NowMap.getView() , enemy.getActor().getCharacter().x , enemy.getActor().getCharacter().y);
        return null;
    }
    //暴击计算
    if(RF.ProbabilityHit(luckNum2)){
        crit = true;
        d = d * (1.5 +  ( RV.GameData.actor.getAddCritF() / 100));
    }
    //计算击退
    var r = RV.GameData.actor.getRepel();
    //buff计算
    var buffs = RV.GameData.actor.getAtkBuffs();
    for(var mid in buffs){
        if(buffs[mid] === 1){
            enemy.addBuff(mid);
        }else if(buffs[mid] === 2){
            enemy.subBuff(mid);
        }
    }
    //返回运算
    return {
        crit : crit,
        damage : d,
        repel : r,
        dir : dir,
        fly : 0
    };
};
/**
 * 敌人对角色攻击计算
 * @param enemy
 * @returns {{damage: *, repel: (number|DSetArms.repel), fly: number, crit: boolean, dir: number}|null}
 */
RF.EnemyAtkActor = function(enemy){
    //获得基础值
    var temp1 =  enemy.getWAtk() - RV.GameData.actor.getWDef();
    var attributeNum =  enemy.getAttribute();
    //计算伤害
    var temp2 = Math.max(1,temp1) * attributeNum.atk - Math.max(1,temp1) * attributeNum.def;
    //离散
    var d1 = temp2 * 0.85;
    var d2 = temp2 * 1.15;
    var d = rand(Math.floor(d1),Math.ceil(d2 + 1));
    //暴击闪避运算
    var crit = false;
    //闪避率
    var luckNum1 = (RV.GameData.actor.getAddDodge() / 100) +  Math.max( 0 , RV.GameData.actor.getSpeed() - enemy.getSpeed()) / (RV.GameData.actor.getSpeed() + enemy.getSpeed()) / 2;
    //暴击率
    var luckNum2 = ( enemy.getAddCrit() / 100) + Math.max( 0 , enemy.getLuck() - RV.GameData.actor.getLuck()) / (RV.GameData.actor.getLuck() + enemy.getLuck()) / 2;
    //计算闪避
    if(RF.ProbabilityHit(luckNum1) || d == 0){
        new LNum(3 , 0 , RV.NowMap.getView() , RV.NowMap.getActor().getCharacter().x ,  RV.NowMap.getActor().getCharacter().y);
        return null;
    }
    //暴击计算
    if(RF.ProbabilityHit(luckNum2)){
        crit = true;
        d = d * (1.5 + (enemy.getAddCritF() / 100));
    }
    RV.NowCanvas.playAnim(enemy.atkAnim,null,RV.NowMap.getActor(),true,null);
    //计算击退
    var r = enemy.getRepel();
    //返回运算
    return {
        crit : crit,
        damage : d,
        repel : r,
        dir : enemy.getDir(),
        fly : 0
    };
};


/**
 * 敌人对敌人攻击计算
 * @param enemy
 * @param enemy2
 * @returns {{damage: *, repel: (number|DSetArms.repel), fly: number, crit: boolean, dir: number}|null}
 */
RF.EnemyAtkEnemy = function(enemy,enemy2){
    //获得基础值
    var temp1 =  enemy.getWAtk() - enemy2.getWDef();
    var attributeNum =  enemy.getAttribute(enemy2);
    //计算伤害
    var temp2 = Math.max(1,temp1) * attributeNum.atk - Math.max(1,temp1) * attributeNum.def;
    //离散
    var d1 = temp2 * 0.85;
    var d2 = temp2 * 1.15;
    var d = rand(Math.floor(d1),Math.ceil(d2 + 1));
    //暴击闪避运算
    var crit = false;
    //闪避率
    var luckNum1 = (enemy2.getAddDodge() / 100) + Math.max( 0 , enemy2.getSpeed() - enemy.getSpeed()) / (enemy2.getSpeed() + enemy.getSpeed()) / 2;
    //暴击率
    var luckNum2 = ( enemy.getAddCrit() / 100) + Math.max( 0 , enemy.getLuck() - enemy2.getLuck()) / (enemy2.getLuck() + enemy.getLuck()) / 2;
    //计算闪避
    if(RF.ProbabilityHit(luckNum1) || d == 0){
        new LNum(3 , 0 , RV.NowMap.getView() , enemy2.getActor().getCharacter().x ,  enemy2.getActor().getCharacter().y);
        return null;
    }
    //暴击计算
    if(RF.ProbabilityHit(luckNum2)){
        crit = true;
        d = d * (1.5 + (enemy.getAddCritF() / 100));
    }
    RV.NowCanvas.playAnim(enemy.atkAnim,null,enemy2.getActor(),true,null);
    //计算击退
    var r = enemy.getRepel();
    //返回运算
    return {
        crit : crit,
        damage : d,
        repel : r,
        dir : enemy.getDir(),
        fly : 0
    };
};

/**
 * 对数组的值进行随机选择
 * @param ary
 * @returns {null|*}
 * @constructor
 */
RF.RandomChoose = function(ary){
    if(ary == null || ary.length <= 0){
        return null;
    }
    return ary[Math.floor(Math.random() * ary.length)];
};
/**
 * 指定概率是否达成
 * @param rate 概率 浮点
 * @returns {boolean}
 */
RF.ProbabilityHit = function(rate){
    return rate >  Math.random();
};
/**
 * 字符串转换AscII
 * @param num
 * @returns {string}
 */
RF.CharToAScII = function(num) {
    return String.fromCharCode(num);
};
/**
 * 保存游戏
 */
RF.SaveGame = function(){
    RV.GameData.save();
    RF.ShowTips("游戏已保存");
};
/**
 * 读取游戏
 */
RF.LoadGame = function(){
    RV.IsDie = false;
    IAudio.BGMFade(2);
    IVal.scene.dispose();
    if(GMain.haveFile()){
        RV.GameData.load();
    }else{
        RV.GameData.init();
    }
    RV.InterpreterMain = new IMain();
    RV.InterpreterOther = [];
    IVal.scene = new SMain();
};

RF.AddOtherEvent = function(events,tag,id){
    var doEvent = new IMain();
    doEvent.addEvents(events);
    doEvent.tag = tag;
    doEvent.NowEventId = id;
    RV.InterpreterOther.push(doEvent);
};

RF.FindOtherEvent = function(tag){
    for(var i = 0;i<RV.InterpreterOther.length;i++){
        if(RV.InterpreterOther[i].tag == tag){
            return RV.InterpreterOther[i];
        }
    }
    return null;
};

RF.CheckLanguage = function(str){
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    if(reg.test(str)){
        return true;
    }
    reg = new RegExp("[\\u3040-\\u309F\\u30A0-\\u30FF]+","g");
    if(reg.test(str)){
        return true;
    }
    reg = new RegExp("[\\u0E00-\\u0E7F]+","g");
    if(reg.test(str)){
        return true;
    }
    return false;
};

RF.MakerValueText = function(str){
    if(str != null){
        var s = str.replaceAll("\\\\[Vv]\\[([a-zA-Z0-9-_]+)]",RF.CharToAScII(60003)+  "[$1]");
        var end = "";
        while(true){
            if(s.length <= 0){
                break;
            }
            var min = s.substring(0,1);
            s = s.substring(1,s.length);
            var c = min.charCodeAt(0);
            if(c == 60003){
                var returnS = RF.TextToTemp(s , "[","]","\\[([a-zA-Z0-9-_]+)]");
                s = RV.GameData.getValues(parseInt(returnS[0])) + returnS[1];
            }else{
                end += min;
            }
        }
        return end;
    }
    return "";
};

RF.TextToTemp = function( mainText, s, e, rex){
    var tmp = mainText.substring(mainText.indexOf(s) + 1,mainText.indexOf(e));
    mainText = mainText.substring(tmp.length + s.length + e.length, mainText.length);
    var temp1 = tmp.replaceAll(rex, "$1");
    var temp_2 = temp1.replaceAll(" ", "");
    var temp_e = temp_2.replaceAll("，", ",");
    return [temp_e,mainText];
};/**
 * Created by 七夕小雨 on 2019/1/3.
 * 全局变量
 */
function RV(){}

//游戏平台
RV.Platform = "PC";//PC Andoir iOS Web WP WeiXin
//游戏当前工程数据
RV.NowProject = null;
//游戏当前资源数据
RV.NowRes = null;
//游戏当前设置数据
RV.NowSet = null;
//游戏UI
RV.NowUI = null;

//游戏当前地图
RV.NowMap = null;
//游戏当前舞台
RV.NowCanvas = null;
//当前执行的触发器ID
RV.NowEventId = -1;
//提示框缓存图片
RV.ToastPics = [];
//伤害数字缓存图片
RV.NumberPics = [];

//游戏数据
RV.GameData = null;
//设置数据
RV.GameSet = null;

//主解释器
RV.InterpreterMain = null;
//异步解释器
RV.InterpreterOther = [];
//角色是否死亡
RV.IsDie = false;

/**
 * UI字体颜色
 */
RV.setColor = {
    //窗口文字
    wBase : IColor.White(),
    //主界面文字
    cBase : IColor.White(),
    //主界面物品技能详情板标题颜色
    detail : IColor.CreatColor(238,201,0),
    //装备界面未装备、未使用文字
    unused : IColor.CreatColor(90,90,90),
    //装备界面比较底板
    show : IColor.Black(),
    //技能界面技能装备状态文字
    tag : IColor.Green(),
    //物品数量文字
    num : IColor.Black(),
    //msgBox按钮文字
    button : IColor.CreatColor(28,28,28),
    //快捷键文字
    shortcut : IColor.Black(),
    //描边
    outline : IColor.Black()
};

//事件读取
RV.isLoad = false;
//缓存
RV.Cache = [];

//常用属性名
RV.ParameterName = {
    hp:"HP",
    mp:"MP",
    lv:"Lv.",
    atk:"物理攻击",
    def:"物理防御",
    mAtk:"魔法攻击",
    mDef:"魔法防御",
    speed:"速度",
    luck:"幸运"
};

/**
 * Created by 七夕小雨 on 2019/1/3.
 * 游戏主场景
 */
function SMain(){
    var _sf = this;
    //==================================== 界面坐标 ===================================
    /**
     * 暴露私有变量，用于计算坐标位置
     */
    this.getEval = function(code){
        return eval(code);
    };
    //==================================== 私有属性 ===================================
    //主界面对象
    var mainUI = null;
    //菜单界面ID
    var uiMenuID = 4;
    //角色对象
    var actor = null;

    //地图实例化
    var map = new LMap(RV.GameData.mapId,function(object){
        initActor(object);
    },RV.GameData.x,RV.GameData.y);
    //地图切换回调
    map.changeMap = function(object){

        display.clear();
        initActor(object);
    };
    //生成画布舞台
    var display = new LCanvas();
    //阻塞主线程执行的窗口
    var dialog = null;
    //不阻塞主线程执行的异步内容
    var dialogParallel = {};
    //预加载判断变量
    var loadOver = true;
    var dieWait = -1;

    //自定义UI
    var selfUIMain = null;
    var selfUIOther = [];

    //==================================== 私有函数 ===================================

    /**
     * 初始化Actor对象
     * @param object
     */
    function initActor(object){
        actor = object;
        //设置死亡回调
        actor.DieDo = function(){
            RV.IsDie = true;
            display.playAnim(RV.NowSet.setAll.actorDieAnimID,null,actor,true);
            if(RV.GameData.actor.hp <= 0){//非意外死亡可以用复活药救活
                // 寻找一下复活道具，如果没有就凉凉
                for(var i = 0;i<RV.GameData.items.length;i++){
                    var item = RV.GameData.items[i];
                    if(item.type == 0){
                        var cof = item.findData();
                        if(cof.afterDeath){
                            item.user(1);
                            RV.GameData.useItem(item.id,1);
                            break;
                        }
                    }
                }
            }else{//意外死亡直接凉凉
                //生命校准为0
                RV.GameData.actor.hp = 0;
            }
            dieWait = 20;
        };
        //设置受伤回调
        actor.InjuredDo = function(type,num){
            var number = 0;
            var showType = 0;
            if(type >= 4){
                showType = 2;
                if(type == 4){
                    number = num;
                }
                RV.GameData.actor.mp -= number;
            }else{
                showType = 0;
                if(type == 0){//固定值伤害
                    number = num;
                }else if(type == 1){//百分比伤害
                    number = RV.GameData.actor.getMaxHP() * num;
                }else if(type == 2){//敌方技能相关发来的攻击
                    obj = num;
                    if(obj == null) return;
                    if(obj.crit && obj.damage > 0){
                        showType = 1;
                    }
                    if(!actor.superArmor){
                        //击退
                        if(obj.dir == 0){
                            actor.getCharacter().y += obj.repel;
                        }else if(obj.dir == 1){
                            actor.getCharacter().x -= obj.repel;
                        }else if(obj.dir == 2){
                            actor.getCharacter().x += obj.repel;
                        }else if(obj.dir == 3){
                            actor.getCharacter().y -= obj.repel;
                        }else if(obj.dir == 4){
                            actor.getCharacter().x -= obj.repel / 1.4;
                            actor.getCharacter().y += obj.repel / 1.4;
                        }else if(obj.dir == 5){
                            actor.getCharacter().x += obj.repel / 1.4;
                            actor.getCharacter().y += obj.repel / 1.4;
                        }else if(obj.dir == 6){
                            actor.getCharacter().x -= obj.repel / 1.4;
                            actor.getCharacter().y -= obj.repel / 1.4;
                        }else if(obj.dir == 7){
                            actor.getCharacter().x += obj.repel / 1.4;
                            actor.getCharacter().y -= obj.repel / 1.4;
                        }
                    }

                    number = obj.damage;
                }else if(type == 3){//来自敌人的攻击
                    var obj = RF.EnemyAtkActor(num);
                    if(obj == null) return;
                    if(obj.crit && obj.damage > 0){
                        showType = 1;
                    }
                    if(!actor.superArmor){
                        //击退
                        if(obj.dir == 0){
                            actor.getCharacter().y += obj.repel;
                        }else if(obj.dir == 1){
                            actor.getCharacter().x -= obj.repel;
                        }else if(obj.dir == 2){
                            actor.getCharacter().x += obj.repel;
                        }else if(obj.dir == 3){
                            actor.getCharacter().y -= obj.repel;
                        }else if(obj.dir == 4){
                            actor.getCharacter().x -= obj.repel / 1.4;
                            actor.getCharacter().y += obj.repel / 1.4;
                        }else if(obj.dir == 5){
                            actor.getCharacter().x += obj.repel / 1.4;
                            actor.getCharacter().y += obj.repel / 1.4;
                        }else if(obj.dir == 6){
                            actor.getCharacter().x -= obj.repel / 1.4;
                            actor.getCharacter().y -= obj.repel / 1.4;
                        }else if(obj.dir == 7){
                            actor.getCharacter().x += obj.repel / 1.4;
                            actor.getCharacter().y -= obj.repel / 1.4;
                        }
                    }
                    number = obj.damage;
                }
                //装备金钱抵消
                if(number > 0){
                    var temp = parseInt(number * (RV.GameData.actor.subMoney() / 100));
                    RV.GameData.money -= parseInt(temp);
                    number -= temp;
                    if(RV.GameData.money <= 0){
                        number += Math.abs(RV.GameData.money);
                        RV.GameData.money = 0;
                    }
                }

                //装备MP抵消
                if(number > 0){
                    temp = number * (RV.GameData.actor.subMp() / 100);
                    var mp = RV.GameData.actor.mp;
                    mp -= parseInt(temp);
                    number -= temp;
                    if(mp < 0){
                        RV.GameData.actor.mp = 0;
                        number += Math.abs(mp);
                    }else if(temp != 0){
                        RV.GameData.actor.mp = mp;
                        new LNum(2 , temp , map.getView() , actor.getCharacter().x , actor.getCharacter().y);
                    }
                }

                RV.GameData.actor.hp -= number;

            }
            if(number > 0){
                actor.stiff(10);
                actor.invincible(60);
                RV.GameData.actor.sumHp += number;
                if(actor.nowSkill != null){
                    if(actor.nowSkill.stopSkill()){
                        actor.nowSkill.update();
                        actor.nowSkill = null;
                    }

                }
            }
            new LNum(showType , number , map.getView() , actor.getCharacter().x , actor.getCharacter().y);



        };

        RV.GameData.actor.updateEquip();
    }
    //==================================== 公有函数 ===================================
    /**
     * 主刷新
     */
    this.update = function(){
        if(!loadOver) return true;
        if(dialog != null && dialog.update()) return true;
        for(var key in dialogParallel){
            dialogParallel[key].update();
        }
        if(selfUIMain != null && selfUIMain.updateUI()) return true;
        for(var i = 0;i< selfUIOther.length;i++){
            selfUIOther[i].updateUI();
        }
        initAutoSelfUI();
        if(IVal.scene != this) return true;
        if(display.update()) return true;
        updateMenu();
        map.update();
        if(RV.InterpreterMain.update()) return true;
        doInterpreterOther();
        //通用触发器刷新
        for(var eid in RV.NowSet.setEvent){
            if(RV.NowSet.setEvent[eid].autoRun){
                RV.NowSet.setEvent[eid].doEvent();
            }
        }
        //挂了就调用凉凉界面
        if(RV.IsDie && dieWait > 0){
            dieWait -= 1;
        }
        if(RV.IsDie && dieWait == 0){
            RF.GameOver();
            dieWait = -1;
            return;
        }
        RV.GameData.actor.updateBuff();
        if(actor != null && mainUI != null && mainUI.phoneMove != null){
            if(!actor.isDie && ( mainUI.phoneMove.moveDir == 4 || (IInput.isKeyPress(RC.Key.left) && IInput.isKeyPress(RC.Key.down) ) )  ){//左下
                if(!RV.GameData.actor.LMove) actor.moveLeftDown();
            }else if(!actor.isDie && ( mainUI.phoneMove.moveDir == 5 || (IInput.isKeyPress(RC.Key.right) && IInput.isKeyPress(RC.Key.down) ) )  ){//左下
                if(!RV.GameData.actor.LMove) actor.moveRightDown();
            }else if(!actor.isDie && ( mainUI.phoneMove.moveDir == 6 || (IInput.isKeyPress(RC.Key.left) && IInput.isKeyPress(RC.Key.up) ) )  ){//左下
                if(!RV.GameData.actor.LMove) actor.moveLeftUp();
            }else if(!actor.isDie && ( mainUI.phoneMove.moveDir == 7 || (IInput.isKeyPress(RC.Key.right) && IInput.isKeyPress(RC.Key.up) ) )  ){//左下
                if(!RV.GameData.actor.LMove) actor.moveRightUp();
            }else if(!actor.isDie && (mainUI.phoneMove.moveDir == 2 || IInput.isKeyPress(RC.Key.right) ) ){
                if(!RV.GameData.actor.LMove) actor.moveRight();
            }else if(!actor.isDie && (mainUI.phoneMove.moveDir == 1 || IInput.isKeyPress(RC.Key.left))){
                if(!RV.GameData.actor.LMove) actor.moveLeft();
            }else if(!actor.isDie && (mainUI.phoneMove.moveDir == 0 || IInput.isKeyPress(RC.Key.down)) ){
                if(!RV.GameData.actor.LMove) actor.moveDown();
            }else if(!actor.isDie && (mainUI.phoneMove.moveDir == 3 || IInput.isKeyPress(RC.Key.up)) ){
                if(!RV.GameData.actor.LMove) actor.moveUp();
            }
            if( (!actor.isDie && !actor.atking()) && mainUI.phoneMove.moveType == 2 || IInput.isKeyPress(RC.Key.run) ){
                actor.speedUp();
            }

            //攻击
            if(!actor.isDie){
                if(RV.GameData.actor.getSetData().attackType == 0){
                    if(mainUI.nextClick || IInput.isKeyDown(RC.Key.atk)){
                        if(!RV.GameData.actor.LAtk) actor.atk();
                    }
                }else{
                    if(mainUI.nextClick || IInput.isKeyPress(RC.Key.atk)){
                        if(!RV.GameData.actor.LAtk) actor.atk();
                    }
                }
            }

        }

        if(RV.isLoad){
            RV.isLoad = false;
            RF.LoadGame();
        }

    };

    function updateMenu(){
        //通过菜单界面操作指令呼叫对应的菜单
        if(RV.GameData.menu == -1){
            _sf.callMenu(uiMenuID);
            RV.GameData.menu = 0;
        }else if(RV.GameData.menu > 0){
            _sf.callMenu(RV.GameData.menu);
            if(RV.GameData.menu != uiMenuID) {
                RV.GameData.menu = -1;
            }else{
                RV.GameData.menu = 0;
            }
        }
        //取消键激活菜单
        if(IInput.isKeyDown(RC.Key.cancel)){
            RV.GameSet.playEnterSE();
            _sf.callMenu(uiMenuID);
            IInput.keyCodeAry = [];
        }
    }

    //执行异步事件集合队列
    function doInterpreterOther(){
        for(var i = RV.InterpreterOther.length - 1 ; i>= 0 ; i--){
            RV.InterpreterOther[i].update();
            if(RV.InterpreterOther[i].isEnd){
                RV.InterpreterOther.remove(RV.InterpreterOther[i]);
            }
        }
    }

    /**
     * 主释放
     */
    this.dispose = function(){
        if(selfUIMain != null){
            selfUIMain.disposeAll();
            selfUIMain = null;
        }
        for(var i = 0;i< selfUIOther.length;i++){
            selfUIOther[i].disposeAll();
        }
        if(dialog != null){
            dialog.dispose();
            dialog = null;
        }
        for(var key in dialogParallel){
            dialogParallel[key].dispose();
        }
        dialogParallel = {};
        map.dispose();
        display.dispose();
        RV.GameData.actor.dispose();
    };

    /**
     * 设置模态对话框
     * @param dl 对话框
     * @param endFuc 窗体结束后回调
     */
    this.setDialog = function(dl,endFuc){
        dialog = dl;
        if(dialog != null){
            dialog.endDo = function(obj){
                endFuc(obj);
                dialog = null;
            }
        }

    };
    /**
     * 设置同步对话框
     * @kname 窗口识别key名称
     * @param dl 对话框
     * @param endFuc 窗口结束回调
     */
    this.setDialogParallel = function(kname,dl,endFuc){
        if(dialogParallel[kname] != null){//同名窗口释放
            dialogParallel[kname].dispose();
            delete  dialogParallel[kname];
        }
        dialogParallel[kname] = dl;
        dialogParallel[kname].endDo = function(obj){
            endFuc(obj);
            delete  dialogParallel[kname];
        }
    };

    this.getDialogParallel = function(kname){
        return dialogParallel[kname];
    };

    /**
     * 暴露私有变量，并执行
     * @param code
     */
    this.getEval = function(code){
        return eval(code);
    };

    this.getMainUI = function(){
        return mainUI;
    };

    this.callMenu = function(id){
        var ui =  RV.NowUI.uis[id];
        _sf.initSelfUI(ui,"");
    };

    this.initSelfUI = function(ui,args){
        if(ui != null){
            if(ui.isParallel && _sf.getSelfUI(ui.id) == null){
                var lui = new LUI(ui,args);
                lui.endDo = function(){
                    for(var i = 0;i<selfUIOther.length;i++){
                        if(selfUIOther[i] == lui){
                            selfUIOther.remove(lui);
                            break;
                        }
                    }
                };
                selfUIOther.push(lui);
                if(mainUI == null && lui.keyMake == "main"){
                    mainUI = lui;
                }
                return lui;
            }else{
                selfUIMain = new LUI(ui,args);
                selfUIMain.endDo = function(){
                    selfUIMain = null;
                };
                return selfUIMain;
            }
        }
    };

    this.getSelfUI = function(id){
        if(selfUIMain != null){
            return selfUIMain;
        }
        for(var i = 0;i<selfUIOther.length;i++){
            if(selfUIOther[i].data.id == id){
                return selfUIOther[i];
            }
        }
        return null;
    };

    function initAutoSelfUI() {
        var uis = RV.NowUI.uis;
        for (var key in uis) {
            var ui = uis[key];
            if (ui.isAutoStart && _sf.getSelfUI(ui.id) == null && ui.startIf.result()) {
                _sf.initSelfUI(ui, "");
            }
        }
    }
}/**
 * Created by 七夕小雨 on 2019/1/4.
 */
function SStart(){
    //是否缓存所有的行走图 可以增加游戏地图切换时的流畅度
    var cacheActor = true;

    var load = 0;
    //读取工程数据
    RV.NowProject = new DProject(function(){
        load += 1;
    });
    //读取资源数据
    RV.NowRes = new DRes(function(){
        load += 1;
    });
    //读取设置数据
    RV.NowSet = new DSet(function(){

        load += 1;
    });
    //读取游戏UI
    RV.NowUI = new DUI(function (){
        load += 1;
    });
    //起屏
    var logoBmp = RF.LoadBitmap("Picture/ifaction_logo.png");
    var logo = null;
    var background = null;
    var logoWait = 120;
    if(logoBmp != null){
        background = new ISprite(RV.NowProject.gameWidth,RV.NowProject.gameHeight,IColor.White());
        background.z = 9000;
        var w = IFont.getWidth("Powered by iFAction",18);
        background.drawTextQ("Powered by iFAction",
            RV.NowProject.gameWidth - w - 10,RV.NowProject.gameHeight - 30,
            IColor.CreatColor(87,87,87),18);
        logo = new ISprite(logoBmp);
        logo.z = 9010;
        logo.yx = 0.5;
        logo.yy = 0.5;
        logo.x = RV.NowProject.gameWidth / 2;
        logo.y = RV.NowProject.gameHeight / 2;
    }
    //缓存事件标志
    RF.LoadCache("System/icon_event.png");
    //读取设置数据
    RV.GameSet = new GSet();
    RV.GameSet.load();

    //缓存伤害数字
    var demagePic = [
        "System/number_0.png",
        "System/number_1.png",
        "System/number_2.png",
        "System/number_3.png",
        "System/miss.png"
    ];

    for(i = 0;i<5;i++){
        RV.NumberPics[i] = RF.LoadBitmap(demagePic[i]);
        RV.NumberPics[i].onload = function(){
            load += 1;
        }
    }

    //主更新
    this.update = function(){
        if(logoBmp != null){
            logoWait -= 1;
            if(logoWait > 0){
                return;
            }
        }
        if(load >= 8){
            RC.KeyInit();
            RF.LoadCache("System/icon_event.png");
            RV.InterpreterMain = new IMain();
            RV.InterpreterOther = [];
            this.dispose();
            RV.GameData = new GMain();
            load = -1;
            loadCache();
        }
    };
    //释放
    this.dispose = function(){
        if(logoBmp != null){
            background.fadeTo(0,40);
            logo.fadeTo(0,40);
            background.setOnEndFade(function(){
                logo.dispose();
                background.dispose();
            });

        }
    };


    //预加载行走图
    function loadCache(){
        if(cacheActor){
            for(var key in RV.NowRes.resActor.length){
                RV.NowRes.resActor[key].loadCache();
            }
        }
        //缓存图标
        for(var k in RV.NowSet.setSkill){
            if(RV.NowSet.setSkill[k] != null && RV.NowSet.setSkill[k].icon != null && RV.NowSet.setSkill[k].icon.length > 0) RF.LoadCache("Icon/" + RV.NowSet.setSkill[k].icon);
        }
        for(k in RV.NowSet.setItem){
            if(RV.NowSet.setItem[k] != null && RV.NowSet.setItem[k].icon != null && RV.NowSet.setItem[k].icon.length > 0) RF.LoadCache("Icon/" + RV.NowSet.setItem[k].icon);
        }
        for(k in RV.NowSet.setArmor){
            if(RV.NowSet.setArmor[k] != null && RV.NowSet.setArmor[k].icon != null && RV.NowSet.setArmor[k].icon.length > 0) RF.LoadCache("Icon/" + RV.NowSet.setArmor[k].icon);
        }
        for(k in RV.NowSet.setArms){
            if(RV.NowSet.setArms[k] != null && RV.NowSet.setArms[k].icon != null && RV.NowSet.setArms[k].icon.length > 0) RF.LoadCache("Icon/" + RV.NowSet.setArms[k].icon);
        }
        IVal.scene = new STitle();
    }


}/**
 * Created by 七夕小雨 on 2020/5/7.
 */
function STitle() {
    var _sf = this;

    var ui = RV.NowUI.uis[parseInt(RV.NowSet.setAll.titleFile)];
    var selfUIMain = null;
    if(ui == null){
        throw "UI is not set for Title 未设置标题界面";
    }else{
        selfUIMain  = new LUI(ui,"");
        selfUIMain.endDo = function(){
            selfUIMain = null;
        }
    }

    this.update = function () {
        if(ui == null) return;
        if(selfUIMain != null){
            selfUIMain.updateUI();
        }
        return true
    };

    this.dispose = function(){
    };

    function updateButton(index){
        if(index == 0){//新的游戏
            if(GMain.haveFile()){//已有存档，弹出msgBox进行询问
                dialog = new WMessageBox("\\s[18]是否重新开始游戏？","确定","取消");
                dialog.endDo = function(e){
                    dialog = null;
                    if(e == 1){
                        _sf.dispose();
                        IAudio.BGMFade(2);
                        RV.GameData.init();
                        IVal.scene = new SMain();
                    }
                }
            }else{//未有存档，直接开始新游戏
                RV.GameData.init();
                _sf.dispose();
                IAudio.BGMFade(2);
                IVal.scene = new SMain();
            }
        }else if(index == 1){//读取存档
            RF.LoadGame();
        }
    }

}/**
 * Created by 七夕小雨 on 2019/1/15.
 * 游戏界面·样例
 */
function WBase(){
    //==================================== 弹出窗口（对话框）范例框架 ===================================
    /**
     * 框架说明：
     * this.endDo 为窗口结束时的回调，对象类型为function
     *
     * obj为 回调时的参数，这里变量为范例命名，可自改
     * 注意：如果使用SMain的setDialog函数或者setDialogParallel函数设置了弹出框，回调函数中只能有一个参数
     * 如果有多个返回值请设置array对象
     *
     * this.update，为对话框内容刷新，返回值为bool，如果在SMain中使用setDialog调用了对话框，返回值为true时，则会阻止主界面所有内容刷新
     * 如果在SMain中使用setDialogParallel调用了对话框，无论返回任何值，都不会阻止主界面内容刷新
     *
     * this.dispose，为对话框释放，需要手动释放，如在update中的范例——当用户按下ESC键，则调用释放窗口
     * 而在对话框释放的过程中，执行endDo函数进行回调
     *
     * 具体调用范例参见 RF.GameOver();
     */
    var _sf = this;
    //==================================== 公有属性 ===================================
    this.endDo = null;
    //==================================== 私有属性 ===================================
    var obj = 0;

    this.update = function(){
        if(IInput.isKeyDown(27)){// 按下ESC
            obj = 1;
            _sf.dispose();
            return false;
        }
        return true;
    };

    this.dispose = function(){
        if(_sf.endDo != null) _sf.endDo(obj);
    };

}/**
 * Created by 七夕小雨 on 2020/5/6.
 */
function WCtrl(ui,_sf,obj){

    _sf.Picture_1.x = 10;
    _sf.Picture_1.y = 10;

}/**
 * Created by YewMoon on 2019/2/25.
 * 游戏界面·装备
 * @param ui
 */
function WEquipment(ui){
    //==================================== 私有属性 ===================================
    var _sf = this;
    var tempObj = null;
    var tempItem = null;
    var tempSelect = 0;
    var tempBagSelect = -1;
    var infoNameList = [];
    var infoDataList = [];
    var infoChangeList = [];
    //==================================== 公有属性 ===================================
    this.uiId = 1;
    //当前装备
    this.equipData = [];
    //当前物品背包
    this.items = [];
    //当前角色参数
    this.actorParameter = [];
    //当前角色形象
    this.actorFigure = null;
    //当前选中装备类型
    this.selectType = 1;
    //当前选中装备部位
    this.selectPart = -1;
    //当前选中装备栏序号
    this.selectIndex = 0;
    //当前选择背包中装备序号
    this.selectBagIndex = -1;
    //选择框激活情况
    this.activityIndex = 0;
    //是否显示装备背包
    this.showBag = false;


    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function(){
        //装备赋值
        for(var i in RV.GameData.actor.equips){
            var id = RV.GameData.actor.equips[i];
            var data = {};
            data.part = parseInt(i);
            data.index = parseInt(i) + 1;
            if(i == -1){
                var temp = RV.NowSet.setArms[id];
                data.type = 1;
                data.pic = temp == null ? "System/null.png":"Icon/" + temp.icon;
                data.parameter = updateData(data,temp);
                _sf.equipData.unshift(data);
            }else{
                temp = RV.NowSet.setArmor[id];
                data.type = 2;
                data.pic = temp == null ? "System/null.png":"Icon/" + temp.icon;
                data.parameter = updateData(data,temp);
                _sf.equipData.push(data);
            }
        }
        //角色数据赋值
        infoNameList = [RV.ParameterName.hp,RV.ParameterName.mp,RV.ParameterName.atk,RV.ParameterName.def,RV.ParameterName.mAtk,RV.ParameterName.mDef,RV.ParameterName.speed,RV.ParameterName.luck];
        infoDataList = [RV.GameData.actor.hp + "/" + RV.GameData.actor.getMaxHP(),RV.GameData.actor.mp + "/" + RV.GameData.actor.getMaxMp(),RV.GameData.actor.getWAtk(),RV.GameData.actor.getWDef(),RV.GameData.actor.getMAtk(),RV.GameData.actor.getMDef(),
            RV.GameData.actor.getSpeed(),RV.GameData.actor.getLuck()];
        infoChangeList = [" "," "," "," "," "," "," "," "," "," "," "," "," "];
        for(i = 0; i<infoNameList.length; i++){
            var tempInfo = {
                name:infoNameList[i],
                data:infoDataList[i],
                change:infoChangeList[i]
            };
            _sf.actorParameter.push(tempInfo)
        }
    };
    /**
     * 初始化后执行
     */
    this.initAfter = function(){
        _sf.actorFigure = new LCharacters(RV.NowRes.findResActor(RV.GameData.actor.getSetData().actorId),null,_sf.actorImage.z,null,null);
        _sf.actorFigure.topZ = true;
        _sf.actorFigure.autoZ = false;
        _sf.actorFigure.mustXY(_sf.actorImage.x + (  _sf.actorImage.width -  _sf.actorFigure.getSpirte().width) / 2,_sf.actorImage.y);
        _sf.actorFigure.CanPenetrate = true;
        flashChoose(_sf.chooseItem,true);
        flashChoose(_sf.chooseBag,false);
    };
    /**
     * 判断装备槽选择
     * @param ctrl 选中槽
     * @param obj 选中槽数据
     */
    this.updateSelect = function(ctrl,obj){
        resetChoose();
        _sf.selectBagIndex = tempBagSelect = -1;
        tempItem = null;
        this.showBag = true;
        this.activityIndex = 0;
        _sf.selectIndex = tempSelect = obj.index;
        if(obj != tempObj){
            RV.GameSet.playSelectSE();
            tempObj = obj;
            _sf.chooseItem.x = ctrl.x;
            _sf.chooseItem.y = ctrl.y;
            _sf.selectType = obj.type;
            _sf.selectPart = obj.part;
            _sf.equipmentBag.changeIF(new DIf());
            _sf.items = RV.GameData.sortItems(_sf.selectType,_sf.selectPart)
        }else{
            RV.GameSet.playEnterSE();
            _sf.toSelectItem();
            updateChange(null);
        }
    };
    /**
     * 判断背包选择
     * @param ctrl 背包选中控件
     * @param obj 背包选中控件的数据
     */
    this.updateBagSelect = function(ctrl,obj){
        //鼠标点击装备背包就解锁背包选择
        this.activityIndex = 1;
        if(ctrl == null){//如果点击了卸下
            tempItem = null;
            resetChoose();
            updateChange(null);
            if(_sf.selectBagIndex == -1 && _sf.equipData[_sf.selectIndex].pic != "System/null.png"){
                RV.GameSet.playEquipSE();
                RV.GameData.actor.equipUnload(_sf.selectPart);
                _sf.items = RV.GameData.sortItems(_sf.selectType,_sf.selectPart);
                _sf.equipmentBag.changeIF(new DIf());
                updateEquipImage(_sf.selectIndex,"System/null.png");
                RV.GameData.actor.updateEquip();
                for(var i = 0; i<_sf.actorParameter.length; i++){
                    _sf.actorParameter[i].change = infoChangeList[i];
                }
                _sf.equipData[_sf.selectIndex].parameter = updateData(_sf.equipData[_sf.selectIndex],null);
            }
            infoDataList = [RV.GameData.actor.hp + "/" + RV.GameData.actor.getMaxHP(),RV.GameData.actor.mp + "/" + RV.GameData.actor.getMaxMp(),RV.GameData.actor.getWAtk(),RV.GameData.actor.getWDef(),RV.GameData.actor.getMAtk(),RV.GameData.actor.getMDef(),
                RV.GameData.actor.getSpeed(),RV.GameData.actor.getLuck()];
            for(i = 0; i<infoDataList.length; i++){
                _sf.actorParameter[i].data = infoDataList[i];
            }
            _sf.selectBagIndex = tempBagSelect = -1;
            return
        }
        _sf.selectBagIndex = tempBagSelect = ctrl.ctrlIndex;
        if(obj != tempItem){
            RV.GameSet.playSelectSE();
            tempItem = obj;
            _sf.chooseBag.x = ctrl.x;
            _sf.chooseBag.y = ctrl.y;
            updateChange(obj);
        }else{
            this.equip(obj);
            _sf.equipData[_sf.selectIndex].parameter = updateData(_sf.equipData[_sf.selectIndex],obj.findData());
            if(obj.num > 0){
                _sf.chooseBag.x = ctrl.x;
                _sf.chooseBag.y = ctrl.y;
            }else{
                resetChoose();
            }
            for(i = 0; i<_sf.actorParameter.length; i++){
                _sf.actorParameter[i].change = infoChangeList[i];
            }
            RV.GameSet.playEquipSE();
            _sf.items = RV.GameData.sortItems(_sf.selectType,_sf.selectPart);
            tempItem = null;
        }
    };


    /**
     * 更新比较数据
     * @param obj 装备对象
     */
    function updateChange(obj){
        var tempData = [];
        if(obj == null){
            tempData = [0,0,0,0,0,0,0,0];
        }else{
            tempData = [obj.findData().maxHP,obj.findData().maxMP,obj.findData().watk,obj.findData().wdef,obj.findData().matk,obj.findData().mdef,obj.findData().luck,obj.findData().speed];
        }

        for(var i = 0; i<_sf.actorParameter.length; i++){
            var value = _sf.equipData[_sf.selectIndex].parameter[i] - tempData[i];
            if(value < 0){
                _sf.actorParameter[i].change = "\\c[0,255,0]"+ "+"+ Math.abs(value);
            }else if(value == 0){
                _sf.actorParameter[i].change = " ";
            }else{
                _sf.actorParameter[i].change = "\\c[255,0,0]" + "-"+ Math.abs(value);
            }
        }
    }

    /**
     * 装备
     * @param obj 装备对象
     */
    this.equip = function (obj) {
        updateData(_sf.equipData[_sf.selectIndex],obj.findData());
        RV.GameData.actor.equipLoad(obj);
        _sf.equipmentBag.changeIF(new DIf());
        updateEquipImage(_sf.selectIndex,"Icon/" + obj.findData().icon);
        RV.GameData.actor.updateEquip();
        updateFlash();
        infoDataList = [RV.GameData.actor.hp + "/" + RV.GameData.actor.getMaxHP(),RV.GameData.actor.mp + "/" + RV.GameData.actor.getMaxMp(),RV.GameData.actor.getWAtk(),RV.GameData.actor.getWDef(),RV.GameData.actor.getMAtk(),RV.GameData.actor.getMDef(),
            RV.GameData.actor.getSpeed(),RV.GameData.actor.getLuck()];
        for(var i = 0; i<infoDataList.length; i++){
            _sf.actorParameter[i].data = infoDataList[i];
        }
        _sf.selectBagIndex = -1;
    };

    /**
     * 进入背包
     */
    this.toSelectItem = function(){
        _sf.activityIndex = 1;
        updateFlash();
    };

    /**
     * 本界面刷新
     */
    this.update = function(){
        _sf.actorFigure.correctShowPosition();
        _sf.actorFigure.updateBase();
        updateFlash();
        if(_sf.activityIndex == 0){
            updateSlotKey();
        }else{
            updateBagKey();
        }

        if(IInput.isKeyDown(RC.Key.cancel)){
            if(_sf.activityIndex == 0){
                _sf.closeUI();
            }else if(_sf.activityIndex == 1){
                RV.GameSet.playCancelSE();
                _sf.activityIndex = 0;
                _sf.selectBagIndex = 0;
                this.showBag = false;
            }
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function(){
        RV.GameSet.playCancelSE();
        LUI.DisposeCtrl(_sf.ctrlItems);
        _sf.actorFigure.disposeBase();
    };

    //==================================== 私有函数 ===================================
    /**
     * 重置选择框位置
     */
    function resetChoose(){
        _sf.chooseBag.x = _sf.buttonUnload.x;
        _sf.chooseBag.y = _sf.buttonUnload.y;
    }
    /**
     * 更新装备图片
     * @param index 序号
     * @param path 图片地址
     */
    function updateEquipImage(index,path){
        var nowCtrl = _sf.slot.ctrlItems[index];
        nowCtrl.obj.pic = path;
        nowCtrl.equipImage.setBitmap(RF.LoadCache(nowCtrl.obj.pic));
    }
    /**
     * 更新参数
     * @param data 数据对象
     * @param tData 目标数据对象
     */
    function updateData(data,tData){
        if(tData == null){
            data.maxHP = 0;
            data.maxMP = 0;
            data.watk = 0;
            data.wdef = 0;
            data.matk = 0;
            data.mdef = 0;
            data.luck = 0;
            data.speed = 0;
        }else{
            data.maxHP = tData.maxHP == null ? 0:tData.maxHP;
            data.maxMP = tData.maxMP == null ? 0:tData.maxMP;
            data.watk = tData.watk == null ? 0:tData.watk;
            data.wdef = tData.wdef == null ? 0:tData.wdef;
            data.matk = tData.matk == null ? 0:tData.matk;
            data.mdef = tData.mdef == null ? 0:tData.mdef;
            data.luck = tData.luck == null ? 0:tData.luck;
            data.speed = tData.speed == null ? 0:tData.speed;
        }
        return[data.maxHP,data.maxMP,data.watk,data.wdef,data.matk,data.mdef,data.speed,data.luck];
    }
    /**
     * 装备栏键盘选择判定
     */
    function updateSlotKey(){
        //选择框向下移动
        if(IInput.isKeyDown(RC.Key.down)){//按下向下键
            tempSelect = _sf.selectIndex + 2;
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){//按下向上键
            tempSelect = _sf.selectIndex - 2;
        }
        //选择框向右移动
        if(IInput.isKeyDown(RC.Key.right)){//按下向右键
            tempSelect = _sf.selectIndex + 1;
        }
        //选择框向左移动
        if(IInput.isKeyDown(RC.Key.left)){//按下向左键
            tempSelect = _sf.selectIndex - 1;
        }
        if(tempSelect < 0){
            tempSelect = _sf.equipData.length - 1;
        }
        if(tempSelect > _sf.equipData.length - 1){
            tempSelect = 0;
        }
        if(_sf.selectIndex != tempSelect){
            _sf.updateSelect(_sf.slot.ctrlItems[tempSelect],_sf.slot.ctrlItems[tempSelect].obj);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateSelect(_sf.slot.ctrlItems[_sf.selectIndex],_sf.slot.ctrlItems[_sf.selectIndex].obj);
        }
    }
    /**
     * 装备背包键盘选择判定
     */
    function updateBagKey(){
        //选择框向下移动
        if(IInput.isKeyDown(RC.Key.down)){//按下向下键
            tempBagSelect = _sf.selectBagIndex + 1;
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){//按下向上键
            tempBagSelect = _sf.selectBagIndex - 1;
        }
        if(tempBagSelect < -1){
            tempBagSelect = _sf.items.length - 1;
        }
        if(tempBagSelect > _sf.items.length - 1){
            tempBagSelect = -1;
        }
        if(_sf.selectBagIndex != tempBagSelect){
            if(tempBagSelect != -1){
                _sf.updateBagSelect(_sf.equipmentBag.ctrlItems[tempBagSelect],_sf.equipmentBag.ctrlItems[tempBagSelect].obj);
            }else{
                _sf.updateBagSelect(null,null);
            }
            var tx = _sf.chooseBag.x + _sf.viewportBag.ox + _sf.viewportBag.x;
            var ty = _sf.chooseBag.y + _sf.viewportBag.oy + _sf.viewportBag.y;
            var rect = new IRect(tx , ty , tx + 2,ty + _sf.chooseBag.height);
            if(!_sf.viewportBag.GetRect().intersects(rect)){
                _sf.viewportBag.oy = (_sf.chooseBag.y - (_sf.viewportBag.height / 2) - _sf.chooseBag.height) * -1;
                if(_sf.viewportBag.oy > 0) _sf.viewportBag.oy = 0;
            }
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            if(tempBagSelect != -1){
                _sf.updateBagSelect(_sf.equipmentBag.ctrlItems[_sf.selectBagIndex],_sf.equipmentBag.ctrlItems[_sf.selectBagIndex].obj);
            }else{
                _sf.updateBagSelect(null,null);
            }
        }
    }
    /**
     * 选择框闪烁
     * @param choose 需要闪烁的选择框
     * @param bool 是否闪烁
     */
    function flashChoose(choose,bool){
        choose.actionLoop = bool;
        choose.addAction(action.fade,0.6,20);
        choose.addAction(action.wait,20);
        choose.addAction(action.fade,1,20);
        choose.addAction(action.wait,20);
    }
    /**
     * 选择框闪烁启用判定
     */
    function updateFlash(){
        if(_sf.activityIndex == 0){
            _sf.chooseItem.actionLoop = true;
            _sf.chooseBag.actionLoop = false;
        }else{
            _sf.chooseItem.actionLoop = false;
            _sf.chooseBag.actionLoop = true;
        }
    }



}
/**
 * Created by YewMoon on 2019/1/22.
 * 游戏界面·游戏胜利
 * @param ui
 */
function WGameWin(ui){
    var _sf = this;
    //==================================== 公有属性 ===================================
    this.endDo = null;
    //==================================== 私有属性 ===================================
    //特效时间
    var effectTime = 0;
    //特效粒子
    var particleLeft = null;
    var particleRight = null;
    var resList = [
        "System/GameWin/effect-grain_1.png",
        "System/GameWin/effect-grain_2.png"];

    //==================================== 私有函数 ===================================
    /**
     * 动态显示游戏胜利界面
     */
    function gameWinAnimation(){
        _sf.imageEffect.addAction(action.wait,120);
        particleLeft = new IParticle([RF.LoadBitmap(resList[0]),RF.LoadBitmap(resList[1])],20,30,0,null);
        particleLeft.z = _sf.imageEffect.z - 1;
        //粒子方向
        particleLeft.dir = 2;
        //粒子动画长度
        particleLeft.line = 130;
        //左发散粒子坐标
        particleLeft.rect = new IRect(_sf.imageEffect.x + _sf.imageEffect.width / 5,_sf.imageEffect.y + _sf.imageEffect.height / 3,_sf.imageEffect.x + _sf.imageEffect.width /2,_sf.imageEffect.y + _sf.imageEffect.height / 4 + _sf.imageEffect.height / 4);
        particleRight = new IParticle([RF.LoadBitmap(resList[0]),RF.LoadBitmap(resList[1])],20,30,0,null);
        particleRight.z = _sf.imageEffect.z - 1;
        //粒子方向
        particleRight.dir = 3;
        //粒子动画长度
        particleRight.line = 130;
        //右发散粒子坐标
        particleRight.rect = new IRect(_sf.imageEffect.x + _sf.imageEffect.width / 2 ,_sf.imageEffect.y + _sf.imageEffect.height / 3,_sf.imageEffect.x + _sf.imageEffect.width - _sf.imageEffect.width / 5,_sf.imageEffect.y  + _sf.imageEffect.height / 4 + _sf.imageEffect.height / 4);
    }
    /**
     * 键盘选择判定
     */
    function updateKey(){
        if(IInput.isKeyDown(RC.Key.down)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.up)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.buttonGroup.DoAction(_sf.buttonGroup.index);
        }
    }
    //==================================== 公有函数 ===================================
    /**
     * 初始化后执行
     */
    this.initAfter = function() {
        gameWinAnimation();
    };
    /**
     * 本界面刷新
     */
    this.update = function () {
        updateKey();
        effectTime += 1;
        particleLeft.update();
        particleRight.update();
        if(effectTime >= 60){
            _sf.imageEffect.fadeTo(1,60);
        }
        if(effectTime >= 120){
            _sf.imageEffect.fadeTo(0.7,60);
            effectTime = 0
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function () {
        particleLeft.dispose();
        particleRight.dispose();
        LUI.DisposeCtrl(_sf.ctrlItems);
    };
}/**
 * Created by YewMoon on 2019/3/1.
 * 游戏界面·物品
 * @param ui
 */
function WInventory(ui){
    //==================================== 私有属性 ===================================
    var _sf = this;
    var tempObj = null;
    var tempKeyObj = null;
    var tempSelectType = -1;
    var tempSelect = 0;
    var tempSelectFunction = 0;
    var tempSelectKey = 0;
    var nullKeyObj = null;
    var tempFunctionType = 0;
    var tempItemData = [];
    var oldCtrl = null;
    var timeClose = 0;
    var timeOpen = 0;
    //==================================== 公有属性 ===================================
    this.uiId = 3;
    //物品数据组
    this.itemData = [];
    //快捷键数据组
    this.keyList = [];
    //当前选中物品分类种类
    this.selectType = -1;
    //当前选中物品
    this.selectIndex = -1;
    //当前选中功能按钮
    this.selectFunctionIndex = 0;
    //当前选中物品在快捷栏中的序号
    this.selectUserItemIndex = 0;
    //当前选中快捷键
    this.selectKeyIndex = 0;
    //是否打开快捷键设置二级界面
    this.callPage = false;
    //当前操作层级 0 分类 1 物品选择 2 快捷键选择
    this.currentStep = 1;
    //当前显示物品详情
    this.currentDetail = null;
    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function (){
        setKeyList();
        getItemData();
        if(_sf.itemData.length >0){
            _sf.selectIndex = 0;
            _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;

        }else{
            _sf.keyList = [];
            _sf.currentStep = 0;
        }

    };

    /**
     * 初始化后执行
     */
    this.initAfter = function (){
        resetFunctionButton();
        flashChoose(_sf.chooseSort,false);
        flashChoose(_sf.chooseFunction,true);
        flashChoose(_sf.chooseKey,false);
        _sf.updateSort();
    };
    /**
     * 刷新功能键显示内容
     * @param index 物品在背包中的序号
     */
    function getButtonText(index){
        var text = "";
        var item = RV.GameData.items[index];
        if(item.type == 0){
            if(item.findData().userType != 0){
                text = "使用";
            }else{
                text = "\\c[164,171,177]"+"使用";
            }
        }else{
            text = "装备";
        }
        return text;
    }

    /**
     * 选择功能键
     * @param ctrl 选中功能键控件
     * @param obj 选中控件的数据
     */
    this.updateFunction = function(ctrl,obj){
        _sf.selectFunctionIndex = tempSelectFunction;
        if(ctrl.obj.type != tempFunctionType){
            _sf.callPage = false;
            tempFunctionType = ctrl.obj.type;
            _sf.chooseFunction.x = ctrl.x;
            _sf.chooseFunction.y = ctrl.y;

        }else{
            if(ctrl.obj.type == 0){
                useItem();
            }else{
                RV.GameSet.playEnterSE();
                _sf.showShortcut(ctrl)
            }
        }
    };
    /**
     * 选择分类
     * @param ctrl 选中分类控件
     * @param obj 选中控件的数据
     */
    this.updateSort = function(ctrl,obj){
        if(_sf.buttonSort.index != _sf.selectType){
            tempSelectType = _sf.selectType = _sf.buttonSort.index;
            tempSelect = _sf.selectIndex = 0;
            sortItemData();
            _sf.itemBag.obj = RV.GameData.sortItems(_sf.selectType - 1);
            resetKey();
            _sf.itemBag.changeIF(new DIf());

            RV.GameSet.playSelectSE();
            _sf.chooseSort.x = _sf.buttonSort.x + _sf.buttonSort.data.dx * _sf.buttonSort.index;
            _sf.currentStep = 0;
            _sf.callPage = false;
            updateFlash();
            if(_sf.itemData.length <= 0){
                _sf.buttonUse.obj = {name :" ",type : -1};
                _sf.buttonKey.obj = {name :" ",type : -1};
                return;
            }
            _sf.chooseBox.x = _sf.itemBag.ctrlItems[0].x;
            _sf.chooseBox.y = _sf.itemBag.ctrlItems[0].y;
            resetFunctionButton();
            _sf.textDetails.obj = _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;
            _sf.buttonUse.obj = _sf.itemData[_sf.selectIndex].useText;
            _sf.buttonKey.obj = _sf.itemData[_sf.selectIndex].key;
            correctText(_sf.buttonUse);
            correctText(_sf.buttonKey);
            clearCurrentKey(_sf.itemBag.ctrlItems[0]);
        }else{
            if(_sf.itemData.length <= 0) return;
            RV.GameSet.playEnterSE();
            _sf.currentStep = 1;
            updateFlash();
        }
    };

    function findKey(id,type){
        var key = "";
        for(var i = 0 ;i< RV.GameData.userItem.length;i++){
            if(RV.GameData.userItem[i] != 0 && RV.GameData.userItem[i].id == id && RV.GameData.userItem[i].type == type){
                return RC.CodeToSting(RC.Key["item" + (i + 1)]);
            }
        }
        return key;
    }
    /**
     * 判断物品选择
     * @param ctrl 选中控件
     */
    this.updateItem = function(ctrl){
        if(_sf.itemData.length <= 0 || ctrl == null || ctrl.ctrlIndex == _sf.selectIndex || _sf.callPage == true) return;
        _sf.callPage = false;
        tempSelect = _sf.selectIndex = ctrl.ctrlIndex;
        tempSelectKey = _sf.selectKeyIndex = 0;
        tempKeyObj = nullKeyObj;
        _sf.buttonUse.obj = _sf.itemData[_sf.selectIndex].useText;
        _sf.buttonKey.obj = _sf.itemData[_sf.selectIndex].key;

        RV.GameSet.playSelectSE();
        _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;
        _sf.chooseBox.x = ctrl.x;
        _sf.chooseBox.y = ctrl.y;
        resetFunctionButton();
        _sf.textDetails.obj = _sf.currentDetail;
        _sf.currentStep = 1;
        updateFlash();
        correctText(_sf.buttonUse);
        correctText(_sf.buttonKey);
        clearCurrentKey(ctrl);
    };
    /**
     * 显示快捷键选择槽
     * @param ctrl 选中控件
     * @param obj 选中控件的数据
     */
    this.showShortcut = function(ctrl,obj){
        _sf.currentStep = 2;
        updateFlash();
        _sf.backKey.width = (40 + 2) * _sf.keyList.length + 2 * 4;
        _sf.chooseBox.actionLoop = false;
        _sf.backKey.x = ctrl.x + _sf.buttonKey.width - _sf.buttonKey.width / 3 + 4;
        _sf.backKey.y = ctrl.y + _sf.buttonKey.height + 6 + _sf.viewportItem.y + _sf.viewportItem.oy;
        _sf.buttonKeyList.x = _sf.backKey.x + 4;
        _sf.buttonKeyList.y = _sf.backKey.y + 10;
        _sf.chooseKey.x =  _sf.buttonKeyList.x;
        _sf.chooseKey.y =  _sf.buttonKeyList.y;
        _sf.selectUserItemIndex = _sf.itemData[_sf.selectIndex].index;
        timeOpen = 5;
    };
    /**
     * 判断快捷键选择
     * @param ctrl 选中快捷键控件
     * @param obj 选中控件的数据
     */
    this.updateKey = function(ctrl,obj){
        tempSelectKey = _sf.selectKeyIndex = ctrl.ctrlIndex;
        if(obj != tempKeyObj){
            tempKeyObj = obj;
            RV.GameSet.playSelectSE();
            _sf.chooseKey.x = ctrl.x;
            _sf.chooseKey.y = ctrl.y;
        }else{
            RV.GameSet.playEquipSE();
            selectKey(ctrl,obj);
            _sf.currentStep = 1;
            tempSelectKey = _sf.selectKeyIndex = 0;
            tempKeyObj = nullKeyObj;
            updateFlash();
        }
    };
    /**
     * 本界面刷新
     */
    this.update = function(){
        if(_sf.viewportItem.oy > 0 && _sf.itemData.length >0){
            _sf.currentStep = 1;
            updateFlash();
            this.callPage = false;
        }
        if(_sf.currentStep == 0){
            updateSortKey();
        }else if(_sf.currentStep == 1){
            updateBagKey();
        }else{
            updateShortcutKey();
        }

        if(IInput.isKeyDown(RC.Key.cancel)){
            if(_sf.currentStep == 0){
                _sf.closeUI();
            }else if(_sf.currentStep == 1){
                RV.GameSet.playCancelSE();
                _sf.currentStep = 0;
                tempObj = null;
                //_sf.selectType = tempSelectType;
                updateFlash();
            }else{
                RV.GameSet.playCancelSE();
                _sf.currentStep = 1;
                tempSelectKey = _sf.selectKeyIndex = 0;
                tempKeyObj = nullKeyObj;
                updateFlash();
                _sf.callPage = false;
            }
        }
        if(timeClose > 0){
            timeClose -= 1;
            if(timeClose <= 0) _sf.callPage = false;
        }
        if(timeOpen > 0){
            timeOpen -= 1;
            if(timeOpen <= 0) _sf.callPage = true;
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function(){
        RV.GameSet.playCancelSE();
        LUI.DisposeCtrl(_sf.ctrlItems);
    };
    //==================================== 私有函数 ===================================
    /**
     * 分类选择判定
     */
    function updateSortKey(){
        if(IInput.isKeyDown(RC.Key.right)){
            tempSelectType = _sf.selectType + 1;
            _sf.buttonSort.index += 1;
        }
        if(IInput.isKeyDown(RC.Key.left)){
            tempSelectType = _sf.selectType - 1;
            _sf.buttonSort.index -= 1;
        }
        if(tempSelectType < 0){
            tempSelectType = _sf.buttonSort.data.num - 1;
            _sf.buttonSort.index = 3;
        }
        if(tempSelectType > _sf.buttonSort.data.num - 1){
            tempSelectType = 0;
            _sf.buttonSort.index = 0;
        }
        if(_sf.selectType != tempSelectType){
            _sf.updateSort();
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateSort();
        }
    }
    /**
     * 键盘选择判定
     */
    function updateBagKey(){
        if(_sf.itemData.length <= 0) return;
        if(IInput.isKeyDown(RC.Key.right)){
            tempSelectFunction = _sf.selectFunctionIndex + 1;
        }
        if(IInput.isKeyDown(RC.Key.left)){
            tempSelectFunction = _sf.selectFunctionIndex - 1;
        }
        if(tempSelectFunction < 0){
            tempSelectFunction = 1;
        }
        if(tempSelectFunction > 1){
            tempSelectFunction = 0;
        }
        if(tempSelect < 0){
            tempSelect = _sf.itemData.length - 1;
        }
        if(tempSelect > _sf.itemData.length - 1){
            tempSelect = 0;
        }
        if(_sf.selectIndex != tempSelect){
            _sf.updateItem(_sf.itemBag.ctrlItems[tempSelect],_sf.itemBag.ctrlItems[tempSelect].obj);
            var tx = _sf.chooseBox.x + _sf.viewportItem.ox + _sf.viewportItem.x;
            var ty = _sf.chooseBox.y + _sf.viewportItem.oy + _sf.viewportItem.y;
            var rect = new IRect(tx , ty , tx + 2,ty + _sf.chooseBox.height);
            if(!_sf.viewportItem.GetRect().intersects(rect)){
                _sf.viewportItem.oy = (_sf.chooseBox.y - (_sf.viewportItem.height / 2) - _sf.chooseBox.height) * -1;
                if(_sf.viewportItem.oy > 0) _sf.viewportItem.oy = 0;
            }
        }
        //选择框向下移动
        if(IInput.isKeyDown(RC.Key.down)){
            tempSelect = _sf.selectIndex + 1;
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){
            tempSelect = _sf.selectIndex - 1;
        }
        if(_sf.selectFunctionIndex != tempSelectFunction){
            if(tempSelectFunction == 0){
                _sf.updateFunction(_sf.buttonUse,_sf.buttonUse.obj);
            }else{
                _sf.updateFunction(_sf.buttonKey,_sf.buttonKey.obj);
            }

        }
        if(IInput.isKeyDown(RC.Key.ok)){
            if(tempSelectFunction == 0){
                _sf.updateFunction(_sf.buttonUse,_sf.buttonUse.obj);
            }else{
                _sf.updateFunction(_sf.buttonKey,_sf.buttonKey.obj);
            }
        }
    }
    /**
     * 快捷键选择
     */
    function updateShortcutKey(){
        if(IInput.isKeyDown(RC.Key.right)){
            tempSelectKey = _sf.selectKeyIndex + 1;
        }
        if(IInput.isKeyDown(RC.Key.left)){
            tempSelectKey = _sf.selectKeyIndex - 1;
        }
        if(tempSelectKey < 0){
            tempSelectKey = _sf.keyList.length - 1;
        }
        if(tempSelectKey > _sf.keyList.length - 1){
            tempSelectKey = 0;
        }
        if(_sf.selectKeyIndex != tempSelectKey){
            _sf.updateKey(_sf.buttonKeyList.ctrlItems[tempSelectKey],_sf.buttonKeyList.ctrlItems[tempSelectKey].obj);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateKey(_sf.buttonKeyList.ctrlItems[_sf.selectKeyIndex],_sf.buttonKeyList.ctrlItems[_sf.selectKeyIndex].obj);
        }
    }
    /**
     * 执行快捷键设置
     * @param ctrl 选中快捷键控件
     * @param obj 选中控件的数据
     */
    function selectKey (ctrl,obj){
        var tempCtrl = _sf.buttonKey;
        var tempName = "";
        tempCtrl.textFunction.data.isAutoUpdate = false;
        if(ctrl.ctrlIndex == 0){
            RV.GameData.userItem[_sf.selectUserItemIndex] = 0;
            _sf.itemData[_sf.selectIndex].key.name = "未设置";
            LUI.setText(tempCtrl.textFunction,"未设置");
            tempName = "未设置";
        }else{
            RV.GameData.userItem[ctrl.ctrlIndex - 1] = 0;
            for(var i = 0; i< RV.NowSet.setAll.maxItems; i++){
                if(RV.GameData.userItem[i].id == _sf.itemData[_sf.selectIndex].cof.id && RV.GameData.userItem[i].type == _sf.itemData[_sf.selectIndex].cof.type){
                    RV.GameData.userItem[i] = 0;
                }
            }
            unload(obj.name);
            RV.GameData.userItem[ctrl.ctrlIndex - 1] = _sf.itemData[_sf.selectIndex].cof;
            _sf.itemData[_sf.selectIndex].key.name = obj.name;
            _sf.itemBag.ctrlItems[_sf.selectIndex].obj.index = _sf.itemData[_sf.selectIndex].index = ctrl.ctrlIndex - 1;
            tempName = obj.name;
        }
        tempCtrl.obj.name = tempName;
        LUI.setText(tempCtrl.textFunction,"\\s[14]" + tempName);
        tempCtrl.textFunction.x = tempCtrl.buttonFunction.x + (tempCtrl.buttonFunction.width - tempCtrl.textFunction.width) / 2;
        tempCtrl.textFunction.data.isAutoUpdate = true;
        updateFlash();
        resetKey();
        var tempCtrlItem = _sf.itemBag.ctrlItems[_sf.selectIndex];
        LUI.setText(tempCtrlItem.textKey,"\\s[14]" + tempName);
        tempCtrlItem.textKey.x = tempCtrlItem.shortcutKey.x + (tempCtrlItem.shortcutKey.width - tempCtrlItem.textKey.width) / 2;
        tempCtrlItem.textKey.y = tempCtrlItem.shortcutKey.y + (tempCtrlItem.shortcutKey.height - tempCtrlItem.textKey.height) / 2;
        timeClose = 5;
    }
    /**
     * 重新为显示的快捷键赋值
     */
    function resetKey(){
        var args = _sf.itemBag.obj;
        for(var i = 0;i<args.length;i++){
            args[i].key = findKey(args[i].id,args[i].type)
        }
    }
    /**
     * 卸下相冲快捷键
     * @param name 选择的快捷键
     */
    function unload(name){
        for(var i = 0; i< _sf.itemBag.ctrlItems.length; i++){
            if(name != " " && _sf.itemData[i].key.name == name){
                _sf.itemData[i].key.name = "未设置";
                _sf.itemData[i].index = -1;
            }
        }
    }
    /**
     * 选择框闪烁
     * @param choose 需要闪烁的选择框
     * @param bool 是否闪烁
     */
    function flashChoose(choose,bool){
        choose.actionLoop = bool;
        choose.addAction(action.fade,0.7,20);
        choose.addAction(action.wait,20);
        choose.addAction(action.fade,0.3,20);
        choose.addAction(action.wait,20);
    }
    /**
     * 选择框闪烁启用判定
     */
    function updateFlash(){
        if(_sf.currentStep == 0){
            _sf.chooseSort.actionLoop = true;
            _sf.chooseFunction.actionLoop = false;
            _sf.chooseKey.actionLoop = false;
        }else if(_sf.currentStep == 1){
            _sf.chooseSort.actionLoop = false;
            _sf.chooseFunction.actionLoop = true;
            _sf.chooseKey.actionLoop = false;
        }else{
            _sf.chooseSort.actionLoop = false;
            _sf.chooseFunction.actionLoop = false;
            _sf.chooseKey.actionLoop = true;
        }
    }
    /**
     * 生成ItemData数据
     */
    function getItemData(){
        _sf.itemData = [];
        tempItemData = [];
        var isPc = IsPC();
        for(var i = 0; i<RV.GameData.items.length; i++){
            var data = RV.GameData.items[i];
            var cof = data.findData();
            if(cof == null) continue;
            var useText = {name :"使用",type : 0};
            var key = {name :"未设置",type : 1};
            var index = -1;
            var haveTrigger = false;
            useText.name = getButtonText(i);
            if(cof.eventId != null && cof.eventId != 0) haveTrigger = true;
            for(var k in RV.GameData.userItem){
                var indexK = parseInt(k);
                if(k != "remove" && RV.GameData.userItem[indexK] != 0 && RV.GameData.userItem[indexK].id == data.id && RV.GameData.userItem[indexK].type == data.type){
                    if(isPc){
                        var tempName = RC.Key["item" + (indexK + 1)];
                        key.name = RC.CodeToSting(tempName);
                    }else{
                        key.name = indexK + 1;
                    }
                    index = indexK;
                    break;
                }
            }
            var cd = "";
            var scope = "";
            var element = "";
            var elementSub = "";
            var HpNum1 = "";
            var HpNum2 = "";
            var MpNum1 = "";
            var MpNum2 = "";
            var maxHP = "";
            var maxMP = "";
            var watk = "";
            var wdef = "";
            var matk = "";
            var mdef = "";
            var speed = "";
            var luck = "";
            cd = cof.cd == null ? "" : "CD(秒) : " + cof.cd + "\\n";
            if(cof.userType >= 3 && cof.triggerWidth != null && cof.triggerHeight != null)scope = "使用范围(格) : " + cof.triggerWidth + "×" + cof.triggerHeight + "\\n";
            element = cof.mainAttribute == 0 ? "" : "属性 : " + RV.NowSet.findAttributeId(cof.mainAttribute).name + "\\n";
            elementSub = cof.otherAttribute == 0 ? "" : "副属性 : " + RV.NowSet.findAttributeId(cof.otherAttribute).name + "\\n";
            if(cof.HpNum1 != null && cof.HpNum1 != 0)HpNum1 = cof.HpNum1 > 0 ? "HP回复 : "+ Math.abs(cof.HpNum1) + "\\n" : "HP伤害 : "+ Math.abs(cof.HpNum1) + "\\n";
            if(cof.HpNum2 != null && cof.HpNum2 != 0)HpNum2 = cof.HpNum2 > 0 ? "HP回复 : "+ Math.abs(cof.HpNum2) + "\\n" : "HP伤害 : "+ Math.abs(cof.HpNum2) + "\\n";
            if(cof.MpNum1 != null && cof.MpNum1 != 0)MpNum1 = cof.MpNum1 > 0 ? "MP回复 : "+ Math.abs(cof.MpNum1) + "\\n" : "MP伤害 : "+ Math.abs(cof.MpNum1) + "\\n";
            if(cof.MpNum2 != null && cof.MpNum2 != 0)MpNum2 = cof.MpNum2 > 0 ? "MP回复 : "+ Math.abs(cof.MpNum2) + "\\n" : "MP伤害 : "+ Math.abs(cof.MpNum2) + "\\n";

            if(cof.maxHP != null && cof.maxHP != 0)maxHP = "最大HP : "+ cof.maxHP + "\\n";
            if(cof.maxMP != null && cof.maxMP != 0)maxMP = "最大MP : "+ cof.maxMP + "\\n";
            if(cof.watk != null && cof.watk != 0)watk = "物理攻击 : "+ cof.watk + "\\n";
            if(cof.wdef != null && cof.wdef != 0)wdef = "物理防御 : "+ cof.wdef + "\\n";
            if(cof.matk != null && cof.matk != 0)matk = "魔法攻击 : "+ cof.matk + "\\n";
            if(cof.mdef != null && cof.mdef != 0)mdef = "魔法防御 : "+ cof.mdef + "\\n";
            if(cof.speed != null && cof.speed != 0)speed = "速度 : "+ cof.speed + "\\n";
            if(cof.luck != null && cof.luck != 0)luck = "幸运 : "+ cof.luck;

            var tempMsg = cof.msg + "\\n" + "\\n" + cd + scope + element + elementSub + HpNum1 + HpNum2 + MpNum1 + MpNum2 + maxHP + maxMP + watk + wdef + matk + mdef + speed + luck;
            var tempDetails = {
                name : cof.name,
                msg : tempMsg
            };

            var tempItem = {
                cof:data,
                data : cof,
                useText : useText,
                key : key,
                index :index,
                detail : tempDetails,
                haveTrigger : haveTrigger
            };
            _sf.itemData.push(tempItem);
            tempItemData.push(tempItem);

        }
    }
    /**
     * 分类ItemData
     */
    function sortItemData(){
        getItemData();
        if(_sf.selectType == 0){
            _sf.itemData = tempItemData;
            return;
        }
        _sf.itemData = [];
        for(var i = 0; i<tempItemData.length; i++){
            if(tempItemData[i].cof.type == _sf.selectType - 1){
                _sf.itemData.push(tempItemData[i]);
            }
        }
    }
    /**
     * 修正使用按钮和快捷键按钮位置
     */
    function resetFunctionButton(){
        _sf.chooseFunction.y = _sf.chooseBox.y + 12;
        _sf.buttonUse.x = _sf.chooseBox.x + 352;
        _sf.buttonKey.x = _sf.chooseBox.x + 424;
        _sf.buttonUse.y = _sf.buttonKey.y = _sf.chooseBox.y + 12;
    }
    /**
     * 修正使用按钮和快捷键按钮文字位置
     * @param ctrl 选中控件
     */
    function correctText(ctrl){
        ctrl.textFunction.data.isAutoUpdate = false;
        LUI.setText(ctrl.textFunction,"\\s[14]" + ctrl.obj.name);
        ctrl.textFunction.x = ctrl.buttonFunction.x + (ctrl.buttonFunction.width - ctrl.textFunction.width) / 2;
        ctrl.textFunction.data.isAutoUpdate = true;
    }
    /**
     * 设置pc与移动端快捷键列表
     */
    function setKeyList(){
        nullKeyObj = {code : -1,name : "无"};
        _sf.keyList.push(nullKeyObj);
        var pc = IsPC();
        for(var i = 0; i < RV.NowSet.setAll.maxItems; i ++){
            var tempKey = null;
            var tempKeyList = null;
            if(pc){
                tempKey = RC.Key["item" + (i + 1)];
                tempKeyList = {
                    code : tempKey,
                    name : RC.CodeToSting(tempKey)
                };
            }else{
                tempKey = i + 1;
                tempKeyList = {
                    code : 0,
                    name : tempKey
                };
            }
            _sf.keyList.push(tempKeyList);
        }
    }
    /**
     * 清除当前快捷键显示
     * @param ctrl 选中控件
     */
    function clearCurrentKey(ctrl){
        if(oldCtrl != ctrl){
            ctrl.number.x -= 80;
            ctrl.textKey.opacity = 0;
            ctrl.shortcutKey.opacity = 0;
            if(oldCtrl != null){
                oldCtrl.number.x += 80;
                oldCtrl.textKey.opacity = 1;
                oldCtrl.shortcutKey.opacity = 1;
            }
        }
        oldCtrl = ctrl;
    }
    /**
     * 使用物品
     */
    function useItem(){
        _sf.callPage = false;
        var cof = _sf.itemData[_sf.selectIndex].cof;
        if(cof.type == 0){
            RV.GameData.useItem(cof.id,1);
            if(cof.findData().se != null && cof.findData().se.file != ""){
                RV.GameSet.playSE("Audio/" + cof.findData().se.file,cof.findData().se.volume);
            }
        }else{
            if(cof.type == 1){
                RV.GameData.actor.equipUnload(-1);
            }else{
                RV.GameData.actor.equipUnload(cof.findData().type);
            }
            RV.GameData.actor.equipLoad(cof);
            RV.GameSet.playEquipSE();
        }
        if(_sf.itemData[_sf.selectIndex].haveTrigger == true || cof.findData().userType >= 2){
            _sf.closeUI();
            RV.GameData.menu = 0;
        }
        var tempNum = cof.num;
        sortItemData();
        if(tempNum <= 0){
            if(_sf.selectIndex > 0) {
                _sf.updateItem(_sf.itemBag.ctrlItems[_sf.selectIndex - 1]);
            }else{
                _sf.selectIndex = -1;
                _sf.updateItem(_sf.itemBag.ctrlItems[0]);
            }
        }
        if(_sf.itemData.length<=0){
            var nullDetails = {
                name : " ",
                msg : " "
            };
            _sf.currentDetail = nullDetails;
            _sf.currentStep = 0;
            _sf.buttonUse.obj = {name :" ",type : -1};
            _sf.buttonKey.obj = {name :" ",type : -1};
            updateFlash();
        }
        _sf.itemBag.changeIF(new DIf());
        if(_sf.itemData.length>0)clearCurrentKey(_sf.itemBag.ctrlItems[_sf.selectIndex]);
    }
}/**
 * Created by 七夕小雨 on 2020/5/20.
 * 游戏界面·游戏运行主界面
 */
function WMain(){
    var _sf = this;

    this.keyMake = "main";
    this.nextClick = false;
    this.jumpClick = false;
    this.items = [];
    this.skills = [];
    this.skillsP = [];
    this.boss = null;
    this.buffList = [];
    this.showTalk = false;
    this.currentBuffDetails = null;

    var tempLvWidth = 0;
    var tempMoney = 0;
    var tempBossHp = 0;
    var tempBuffLength = 0;



    this.init = function(){
        _sf.skillsP.length = 0;
        for(var i = 0;i<10;i++){
            var obj = reSkillMin(i);
            _sf.skillsP.push(obj);
        }
    };

    this.initAfter = function(){
        _sf.coin.opacity = 0;
        _sf.coinText.opacity = 0;
        _sf.tipBack.opacity = 0;
        _sf.tipText.opacity = 0;
        _sf.reItems();
        _sf.reSkills();
    };

    this.update = function(){
        updateBuff();
        if(_sf.boss != null && _sf.boss.hp <= 0){
            _sf.boss = null;
        }
        updateBossBar();
        updateLvText();
        updateMoney();
        _sf.nextClick = false;
        _sf.jumpClick = false;
        if(_sf.showTalk && _sf.phoneCtrl.talkButton != null){
            _sf.phoneCtrl.talkButton.opacity = 1;
            _sf.phoneCtrl.atkButton.opacity = 0.1;
        }else if(_sf.phoneCtrl.talkButton != null){
            _sf.phoneCtrl.talkButton.opacity = 0;
            _sf.phoneCtrl.atkButton.opacity = 1;
        }
        _sf.showTalk = false;
    };

    this.reItems = function(){
        _sf.items.length = 0;
        for(var i = 0;i<RV.NowSet.setAll.maxItems;i++){
            var obj = reItemMin(i);
            _sf.items.push(obj);
        }
        _sf.itemCtrl.changeIF(new DIf());
        if(!IsPC()){
            _sf.itemCtrl.x = _sf.phoneMove.x + _sf.phoneMove.width + 80;
        }
    };

    this.reSkills = function(){
        _sf.skills.length = 0;
        for(var i = 0;i<RV.NowSet.setAll.maxSkills;i++){
            var obj = reSkillMin(i);
            _sf.skills.push(obj);

        }
        _sf.skillCtrl.changeIF(new DIf());
    };

    function reItemMin(index){
        var obj = {};
        var bag = RV.GameData.userItem[index];
        obj.key = RC.Key["item" + (index + 1)];
        obj.time = 0;
        obj.index = index;
        obj.num = 0;
        if(bag != 0){
            obj.data = bag;
            obj.cof = bag.findData();
            obj.pic = "Icon/" + obj.cof.icon;
            obj.cd = 3;
            if(bag.type == 0){
                obj.cd = obj.cof.cd;
            }
            obj.msg = obj.cof.name + "\\n" + obj.cof.msg;
            obj.num = obj.data.num;
        }else{
            obj.data = 0;
            obj.cof = null;
            obj.cd = 0;
            obj.msg = null;
            obj.pic = "System/null.png";
        }
        return obj;
    }

    function reSkillMin(index){
        var obj = {};
        var skill = RV.GameData.userSkill[index];
        obj.key = RC.Key["skill" + (index + 1)];
        obj.time = 0;
        obj.index = index;
        obj.id = skill;
        if(skill != 0){
            obj.data = RV.NowSet.setSkill[skill];
            obj.pic = "Icon/" + obj.data.icon;
            obj.cd = obj.data.cd;
            obj.msg = obj.data.name + "\\n" + obj.data.msg;
        }else{
            obj.data = 0;
            obj.cd = 0;
            obj.msg = null;
            obj.pic = "System/null.png";
        }
        return obj;
    }

    //查找buff
    function findSameBuff(id){
        for(var i = 0; i<_sf.buffList.length; i++){
            if(_sf.buffList[i].data.id == id){
                return i;
            }
        }
        return -1;
    }

    //显示详情
    this.showDetail = function(ctrl,str,x,y,isV){
        if(isV == false) isV = false;
        _sf.currentBuffDetails = str;
        _sf.textDetails.obj = _sf.currentBuffDetails;
        LUI.setText(_sf.textDetails,_sf.currentBuffDetails);
        _sf.backDetails.width = _sf.textDetails.width + _sf.textDetails.data.x * 2;
        _sf.backDetails.height = _sf.textDetails.height + _sf.textDetails.data.y * 2;
        if(x + _sf.backDetails.width > RV.NowProject.gameWidth){
            x = RV.NowProject.gameWidth - _sf.backDetails.width - 5;
        }
        _sf.backDetails.x = x;
        if(isV){
            _sf.backDetails.y =  y - _sf.backDetails.height;
        }else{
            _sf.backDetails.y = y;
        }

        _sf.textDetails.x = _sf.backDetails.x + (_sf.backDetails.width - _sf.textDetails.width) / 2;
        _sf.textDetails.y = _sf.backDetails.y + _sf.textDetails.data.y;
    };
    //刷新buff
    function updateBuff (){
        if(RV.GameData.actor.buff.length != tempBuffLength){
            _sf.buffList = [];
            for(var i = 0 ; i<RV.GameData.actor.buff.length; i++){
                updateBuffMin(i,false);
            }
            tempBuffLength = RV.GameData.actor.buff.length;
            _sf.buff.changeIF(new DIf());
        }else{
            for(i = 0;i<RV.GameData.actor.buff.length;i++){
                updateBuffMin(i,true);
            }
        }
        for( i = 0; i< _sf.buff.ctrlItems.length; i++){
            _sf.buff.ctrlItems[i].obj = _sf.buffList[i]
        }
    }

    //刷新单个buff控件
    function updateBuffMin(i,update){
        var index = findSameBuff(RV.GameData.actor.buff[i].getData().id);
        if(index != -1){
            if(!update){
                _sf.buffList[index].num += 1;
                if(RV.GameData.actor.buff[i].endTime > _sf.buffList[index].time) _sf.buffList[index].time = RV.GameData.actor.buff[i].endTime;
                if(RV.GameData.actor.buff[i].endMove > _sf.buffList[index].step) _sf.buffList[index].step = RV.GameData.actor.buff[i].endMove;
            }else{
                if(RV.GameData.actor.buff[i].endTime != _sf.buffList[index].time) _sf.buffList[index].time = RV.GameData.actor.buff[i].endTime;
                if(RV.GameData.actor.buff[i].endMove != _sf.buffList[index].step) _sf.buffList[index].step = RV.GameData.actor.buff[i].endMove;
            }
        }else if(!update){
            var tempBuff = {
                icon : "Icon/"+ RV.GameData.actor.buff[i].getIcon(),
                data : RV.GameData.actor.buff[i].getData(),
                time : RV.GameData.actor.buff[i].endTime,
                step : RV.GameData.actor.buff[i].endMove,
                oldTime :RV.GameData.actor.buff[i].endTime,
                oldStep : RV.GameData.actor.buff[i].endMove,
                num : 1
            };
            _sf.buffList.push(tempBuff);
        }
    }

    //使用快捷栏道具
    this.userItem = function(ctrl){

        if(ctrl.obj.data == 0 || ctrl.obj.time > 0 || ctrl.obj.cof.userType == 0) return;
        if(ctrl.obj.data.type == 0){
            ctrl.obj.data.user(1);
            if(!ctrl.obj.cof.noExpend) ctrl.obj.data.num -= 1;
        }else if(ctrl.obj.data.type == 1){
            RV.GameSet.playEquipSE();
            RV.GameData.actor.equipUnload(-1);
            RV.GameData.actor.equipLoad(ctrl.obj.data);
            RV.GameData.actor.updateEquip();
        }else if(ctrl.obj.data.type == 2){
            RV.GameSet.playEquipSE();
            RV.GameData.actor.equipUnload(ctrl.obj.cof.type);
            RV.GameData.actor.equipLoad(ctrl.obj.data);
            RV.GameData.actor.updateEquip();
        }

        //控件刷新
        if(ctrl.obj.data.num > 0){
            LUI.setText(ctrl.numText , "\\s[" + ctrl.numText.data.fontSize  +"]× " + ctrl.obj.data.num);
            LUI.RePoint(ctrl.numText , ctrl.ctrlItems , 0 , 0);
            ctrl.obj.time = ctrl.obj.cd * 60;
            ctrl.itemCover.opacity = 1;
            ctrl.timeText.opacity = 1;
            ctrl.obj.num = ctrl.obj.data.num;
            var time = (ctrl.obj.time / 60).toFixed(1);
            LUI.setText(ctrl.timeText, "\\s[" + ctrl.timeText.data.fontSize  +"] " + time + "\\s[15]s");
            LUI.RePoint(ctrl.timeText , ctrl.ctrlItems , 0 , 0);
        }else{
            RV.GameData.discardItem(ctrl.obj.data,99);
            RV.GameData.userItem[ctrl.obj.index] = 0;
            LUI.setText(ctrl.numText , " ");
            ctrl.obj.pic = "System/null.png";
            ctrl.icon.setBitmap(RF.LoadCache(ctrl.obj.pic) );
        }
    };

    //更新快捷栏状态
    this.updateItem = function(ctrl){
        if(IInput.isKeyDown(ctrl.obj.key)) {
            _sf.userItem(ctrl);
        }
        if(ctrl.obj.time > 0){
            ctrl.obj.time -= 1;
            if(ctrl.obj.time == 0 || ctrl.obj.time % 10 == 0){
                var time = (ctrl.obj.time / 60).toFixed(1);
                LUI.setText(ctrl.timeText, "\\s[" + ctrl.timeText.data.fontSize  +"] " + time + "\\s[15]s");
                LUI.RePoint(ctrl.timeText , ctrl.ctrlItems , 0 , 0);
                if(ctrl.obj.time <= 0){
                    ctrl.itemCover.opacity = 0;
                    ctrl.timeText.opacity = 0;
                }
            }
            return;
        }
        //自动更新内容
        if(RV.GameData.userItem[ctrl.obj.index] != ctrl.obj.data || (ctrl.obj.data != 0 && ctrl.obj.num != ctrl.obj.data.num)){

            ctrl.obj = reItemMin(ctrl.obj.index);
            ctrl.icon.setBitmap(RF.LoadCache(ctrl.obj.pic) );
            LUI.RePoint(ctrl.icon , ctrl.ctrlItems , 0 , 0);
            if(ctrl.obj.data == 0){
                LUI.setText(ctrl.numText , " ");
            }else{
                ctrl.obj.num = ctrl.obj.data.num;
                if(ctrl.obj.num <= 0){
                    RV.GameData.userItem[ctrl.obj.index] = 0;
                    LUI.setText(ctrl.numText , " ");
                    ctrl.obj.pic = "System/null.png";
                    ctrl.icon.setBitmap(RF.LoadCache(ctrl.obj.pic) );
                }else{
                    LUI.setText(ctrl.numText , "\\s[" + ctrl.numText.data.fontSize  +"]× " + ctrl.obj.data.num);
                }
            }
            LUI.RePoint(ctrl.numText , ctrl.ctrlItems , 0 , 0);
        }

    };

    //使用技能
    this.userSkill = function(ctrl){
        if(ctrl.obj.data == 0 || ctrl.obj.time > 0) return;
        if(RV.GameData.actor.mp < ctrl.obj.data.useMp){
            RF.ShowTips("MP不足");
            return;
        }
        RV.GameData.actor.mp -= ctrl.obj.data.useMp;
        RV.NowCanvas.playSkill(RV.NowMap.getActor() , ctrl.obj.id , RV.GameData.actor);
        //控件刷新
        ctrl.obj.time = ctrl.obj.cd * 60;
        ctrl.skillCover.opacity = 1;
        ctrl.timeText.opacity = 1;
        var time = (ctrl.obj.time / 60).toFixed(1);
        LUI.setText(ctrl.timeText, "\\s[" + ctrl.timeText.data.fontSize  +"] " + time + "\\s[15]s");
        LUI.RePoint(ctrl.timeText , ctrl.ctrlItems , 0 , 0);
    };

    //更新技能栏状态
    this.updateSkill = function(ctrl){
        if(IInput.isKeyDown(ctrl.obj.key)) {
            _sf.userSkill(ctrl);
        }
        if(ctrl.obj.time > 0){
            ctrl.obj.time -= 1;
            if(ctrl.obj.time == 0 || ctrl.obj.time % 10 == 0){
                var time = (ctrl.obj.time / 60).toFixed(1);
                LUI.setText(ctrl.timeText, "\\s[" + ctrl.timeText.data.fontSize  +"] " + time + "\\s[15]s");
                LUI.RePoint(ctrl.timeText , ctrl.ctrlItems , 0 , 0);
                if(ctrl.obj.time <= 0){
                    ctrl.skillCover.opacity = 0;
                    ctrl.timeText.opacity = 0;
                }
            }
            return;
        }
        //自动更新内容
        if(RV.GameData.userSkill[ctrl.obj.index] != ctrl.obj.id){
            ctrl.obj = reSkillMin(ctrl.obj.index);
            ctrl.icon.setBitmap(RF.LoadCache(ctrl.obj.pic) );
            LUI.RePoint(ctrl.icon , ctrl.ctrlItems , 0 , 0);
        }
    };

    this.setPhoneButton = function(b){
        _sf.showTalk = b;

    };

    //呼叫敌人BOSS血条
    this.callBossBar = function(enemy){
        _sf.boss = enemy;
        if(enemy == null) return;
        _sf.boss.name = enemy.getData().name;
        _sf.boss.maxHp = enemy.getMaxHP();
        _sf.bossHpBar.obj = _sf.boss;
    };

    //刷新敌人boss血条
    function updateBossBar(){
        if(_sf.boss != null && _sf.boss.hp != tempBossHp){
            _sf.bossHpBar.obj = _sf.boss;
            _sf.boss.name = _sf.boss.getData().name;
            _sf.boss.maxHp = _sf.boss.getMaxHP();
            tempBossHp = _sf.bossHpBar.obj.hp;
        }
    }

    //等级对齐
    function updateLvText(){
        if(tempLvWidth == _sf.levelText.width) return;
        tempLvWidth = _sf.levelText.width;
        _sf.levelText.x = _sf.lvBack.x + (_sf.lvBack.width - _sf.levelText.width) / 2;
    }

    //金钱刷新效果
    function updateMoney(){
        if(tempMoney == RV.GameData.money) return;
        tempMoney = RV.GameData.money;
        _sf.coin.opacity = 1;
        _sf.coinText.opacity = 1;
        _sf.coin.pauseAnim();
        _sf.coinText.pauseAnim();
        _sf.coin.addAction(action.wait,120);
        _sf.coin.addAction(action.fade,1,0,90);
        _sf.coinText.addAction(action.wait,120);
        _sf.coinText.addAction(action.fade,1,0,90);
    }


}/**
 * Created by YewMoon on 2020/5/27.
 * 游戏界面·菜单
 * @param ui
 */
function WMenu(ui){
    var _sf = this;
    this.keyName = "";
    this.keyCode = "";
    this.init = function(){
        var keyText1 = "向上移动/上切换\\n向下移动/下切换\\n向左移动/左切换\\n向右移动/右切换\\n跑步\\n普通攻击\\n确认\\n呼出菜单/关闭界面\\n";
        var keyText2 = "";
        var keyText3 = "";
        var keyCode1 = RC.CodeToSting(RC.Key.up)+"\\n"+RC.CodeToSting(RC.Key.down)+"\\n"+RC.CodeToSting(RC.Key.left)+"\\n"+RC.CodeToSting(RC.Key.right)+"\\n"
            +RC.CodeToSting(RC.Key.run)+"\\n"+RC.CodeToSting(RC.Key.atk)+"\\n"+RC.CodeToSting(RC.Key.ok)+"\\n"+RC.CodeToSting(RC.Key.cancel)+"\\n";
        var keyCode2 = "";
        var keyCode3 = "";
        if(RV.NowSet.setAll.maxItems > 0){
            keyText1 += "\\n";
            keyCode1 += "\\n";
        }
        for(var i = 0; i<RV.NowSet.setAll.maxItems; i++){
            keyText2 += "使用道具"+ (i + 1) + "\\n";
            var tempNameI = RC.Key["item" + (i + 1)];
            keyCode2 += RC.CodeToSting(tempNameI)+"\\n"
        }
        for(i = 0; i<RV.NowSet.setAll.maxSkills; i++){
            keyText3 += "使用技能"+ (i + 1) + "\\n";
            var tempNameS = RC.Key["skill" + (i + 1)];
            keyCode3 += RC.CodeToSting(tempNameS)+"\\n"
        }
        _sf.keyName = keyText1 + keyText2 + "\\n"+ keyText3;
        _sf.keyCode = keyCode1 + keyCode2 + "\\n"+ keyCode3;

    };
    this.initAfter = function(){

    };
    this.update = function(){
        if(IInput.isKeyDown(RC.Key.down)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 2;
            }else if(_sf.buttonGroup.index == 2){
                _sf.buttonGroup.index = 3;
            }else{
                _sf.buttonGroup.index = 0;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.up)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 3;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
            }else if(_sf.buttonGroup.index == 2){
                _sf.buttonGroup.index = 1;
            }else{
                _sf.buttonGroup.index = 2;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.buttonGroup.DoAction(_sf.buttonGroup.index);
        }
    };
    this.dispose = function(){
        LUI.DisposeCtrl(_sf.ctrlItems);
    }
}/**
 * Created by YewMoon on 2019/4/25.
 * 游戏界面·询问框
 * @param ui
 * @param msgData 询问框数据
 */
function WMessageBox(ui,msgData){
    //==================================== 私有属性 ===================================
    var _sf = this;
    //==================================== 公有属性 ===================================
    this.msg = "";
    this.confirmText = "";
    this.cancelText = "";
    this.endDo = null;
    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function(){
        var temp = msgData.split("||");
        _sf.msg = temp[0];
        _sf.confirmText = temp[1];
        _sf.cancelText = temp[2];
    };
    /**
     * 初始化后执行
     */
    this.initAfter = function(){
        _sf.backMain.width = _sf.textMsg.width + _sf.textMsg.data.x * 2 + 80;
        _sf.backMain.height = _sf.textMsg.height + _sf.textMsg.data.y * 2 + _sf.buttonConfirm.height + 20;
        if(_sf.backMain.width <= 200)_sf.backMain.width = 200;
        _sf.backMain.x = (IVal.GWidth -  _sf.backMain.width)/ 2;
        _sf.backMain.y = (IVal.GHeight -  _sf.backMain.height)/ 2;
        _sf.textMsg.x = _sf.backMain.x + (_sf.backMain.width - _sf.textMsg.width) / 2;
        _sf.textMsg.y = _sf.backMain.y + _sf.textMsg.data.y;
        if(_sf.cancelText == ""){
            _sf.buttonConfirm.x = _sf.backMain.x + (_sf.backMain.width - _sf.buttonConfirm.width) / 2;
        }else{
            _sf.buttonConfirm.x = _sf.backMain.x + (_sf.backMain.width/ 2 - _sf.buttonConfirm.width) / 2;
            _sf.buttonCancel.x = _sf.backMain.x + _sf.backMain.width/ 2 + (_sf.backMain.width/ 2 - _sf.buttonCancel.width) / 2;
            _sf.buttonCancel.y = _sf.backMain.y + _sf.backMain.height - _sf.buttonCancel.height - 10;
        }
        _sf.buttonConfirm.y = _sf.backMain.y + _sf.backMain.height - _sf.buttonConfirm.height - 10;
    };
    /**
     * 本界面刷新
     */
    this.update = function(){
        if(IInput.isKeyDown(RC.Key.ok)){
            RV.GameSet.playEnterSE();
            _sf.dispose(0)
        }
        if(IInput.isKeyDown(RC.Key.cancel)){
            RV.GameSet.playCancelSE();
            _sf.dispose(1);
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function(message){
        if (_sf.endDo != null) _sf.endDo(message);
        LUI.DisposeCtrl(_sf.ctrlItems);
    }
}/**
 * Created by YewMoon on 2019/3/4.
 * 游戏界面·系统
 * @param ui
 */
function WOption(ui){
    var _sf = this;
    //==================================== 公有属性 ===================================
    this.uiId = 4;
    this.bgm = null;
    this.se = null;
    //选择框图片地址
    this.imageChoose = "";
    this.barLoadOver = false;
    this.selectIndex = 0;
    this.initBar = false;
    //==================================== 私有属性 ===================================
    //当前选中序号
    var waitMax = 10;
    var addVolume = 0;
    var waitTime = 0;
    var tempVolume = 0;
    var resList = [
        "System/Menu/Option/button-num_1.png",
        "System/Menu/buttonGroup_1.png"
    ];
    //==================================== 私有函数 ===================================

    /**
     * 判断PC端按钮的选择
     */
    function updatePCKey(){
        if(IInput.isKeyDown(RC.Key.down)){//按下向下键
            RV.GameSet.playSelectSE();
            if(_sf.buttonGroup.index == -1){
                if(_sf.selectIndex == 0){
                    _sf.selectIndex = 1;
                    updateVolumeChoose(_sf.barSE.buttonNum);
                }else if(_sf.selectIndex == 1){
                    _sf.selectIndex = 2;
                    _sf.buttonGroup.index = 0;
                    _sf.updateButton(_sf.buttonGroup.index);
                }
            }else if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
                _sf.selectIndex = 3;
                _sf.updateButton(_sf.buttonGroup.index);
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = -1;
                _sf.selectIndex = 0;
                updateVolumeChoose(_sf.barBGM.buttonNum);
            }
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){//按下向上键
            RV.GameSet.playSelectSE();
            if(_sf.buttonGroup.index == -1){
                if(_sf.selectIndex == 0){
                    _sf.buttonGroup.index = 1;
                    _sf.selectIndex = 3;
                    _sf.updateButton(_sf.buttonGroup.index);
                }else if(_sf.selectIndex == 1){
                    _sf.selectIndex = 0;
                    _sf.buttonGroup.index = -1;
                    updateVolumeChoose(_sf.barBGM.buttonNum);
                }
            }else if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = -1;
                _sf.selectIndex = 1;
                updateVolumeChoose(_sf.barSE.buttonNum);
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
                _sf.selectIndex = 2;
                _sf.updateButton(_sf.buttonGroup.index);
            }
        }

        //按下左调节按钮
        if(IInput.isKeyPress(RC.Key.left)){//按下向左键
            waitTime -= 1;
            addVolume = -1;
        }else if(IInput.isKeyPress(RC.Key.right)){//按下向左键
            waitTime -= 1;
            addVolume = 1;
        }else{
            waitMax = 10;
        }
        if(_sf.selectIndex < 2) updateVolumeNum(_sf.selectIndex);

        if(IInput.isKeyDown(RC.Key.ok)){
            if(_sf.selectIndex == 2){
                _sf.buttonGroup.DoAction(0);
                return true;
            }else if(_sf.selectIndex == 3){
                _sf.buttonGroup.DoAction(1);
                return true;
            }
        }
    }

    function updateVolumeNum(type){
        if(waitTime <= 0){
            waitTime = waitMax;
            if(waitMax > 0) waitMax -= 1;
            if(type == 0){
                tempVolume =  RV.GameSet.BGMVolume;
                tempVolume += addVolume;
                _sf.bgm.value = RV.GameSet.BGMVolume = _sf.updateVolume(_sf.barBGM , tempVolume);
            }else{
                tempVolume = RV.GameSet.SEVolume;
                tempVolume += addVolume;
                _sf.se.value = RV.GameSet.SEVolume = _sf.updateVolume(_sf.barSE , tempVolume);
            }
        }
    }

    /**
     * 选择框闪烁
     * @param choose 需要闪烁的选择框
     * @param bool 是否闪烁
     */
    function flashChoose(choose,bool){
        choose.actionLoop = bool;
        choose.addAction(action.fade,0.6,20);
        choose.addAction(action.wait,20);
        choose.addAction(action.fade,1,20);
        choose.addAction(action.wait,20);
    }
    function updateVolumeChoose(ctrl){
        _sf.imageChoose = resList[0];
        _sf.chooseBox.setBitmap(RF.LoadCache(_sf.imageChoose));
        _sf.chooseBox.x = ctrl.x;
        _sf.chooseBox.y = ctrl.y;
    }

    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function (){
        _sf.bgm = {
            value :RV.GameSet.BGMVolume,
            maxValue : 100,
            ratio :parseInt(RV.GameSet.BGMVolume / 100 * 100) + "%"
        };
        _sf.se = {
            value :RV.GameSet.SEVolume,
            maxValue : 100,
            ratio :parseInt(RV.GameSet.SEVolume / 100 * 100) + "%"
        };
        _sf.imageChoose = resList[0]
    };
    /**
     * 初始化后执行
     */
    this.initAfter = function(){
        _sf.buttonGroup.index = -1;
        flashChoose(_sf.chooseBox,true);
    };


    this.updateMouseVolume = function(type){
        _sf.buttonGroup.index = -1;
        if(type == 0){
            var end = 110 * (( (IInput.x - _sf.barBGM.buttonNum.width / 2) - _sf.regionBgm.x)  / _sf.regionBgm.width);
            tempVolume = end;
            _sf.bgm.value = RV.GameSet.BGMVolume = _sf.updateVolume(_sf.barBGM , tempVolume);
            _sf.selectIndex = 0;
        }else{
            end = 110 * (( (IInput.x - _sf.barBGM.buttonNum.width / 2) - _sf.regionSe.x)  / _sf.regionSe.width);
            //tempVolume = RV.GameSet.SEVolume;
            tempVolume = end;
            _sf.se.value = RV.GameSet.SEVolume = _sf.updateVolume(_sf.barSE , tempVolume);
            _sf.selectIndex = 1;
        }
    };
    this.updateVolume = function(ctrl,num){
        var end =  parseInt(Math.min(100,Math.max(0,num)));
        var nowX =  ctrl.barNum.x + ((end / 100) * ctrl.barNum.width);
        ctrl.obj.ratio = end + "%";
        ctrl.buttonNum.x = nowX;
        updateVolumeChoose(ctrl.buttonNum);
        return end;
    };

    /**
     * 本界面刷新
     */
    this.update = function(){
        if(!_sf.barLoadOver) return;
        updatePCKey();
        if(_sf.initBar){
            RV.GameSet.SEVolume = _sf.updateVolume(_sf.barSE , RV.GameSet.SEVolume);
            RV.GameSet.BGMVolume = _sf.updateVolume(_sf.barBGM , RV.GameSet.BGMVolume);
            _sf.initBar = false;
        }
        if(IInput.isKeyDown(RC.Key.cancel)){//按下取消按钮、关闭按钮或按下关闭键
            RV.GameSet.save();
        }
    };

    this.updateButton = function(index){
        _sf.selectIndex = index + 2;
        _sf.chooseBox.x = _sf.buttonGroup.x;
        _sf.chooseBox.y = _sf.buttonGroup.y - 4 + _sf.buttonGroup.data.dy * index;
        _sf.imageChoose = resList[1];
        _sf.chooseBox.setBitmap(RF.LoadCache(_sf.imageChoose));
    };
    /**
     * 本界面释放
     */
    this.dispose = function(){
        RV.GameSet.playCancelSE();
        LUI.DisposeCtrl(_sf.ctrlItems);
    }
}/**
 * Created by YewMoon on 2019/3/26.
 * 游戏界面·商店
 * @param ui
 * @param shopData 可售物品数据
 */
function WShop(ui,shopData){
    //==================================== 私有属性 ===================================
    var _sf = this;
    //==================================== 公有属性 ===================================
    this.item = null;
    this.init = function(){
        _sf.item = shopData;
    };
    this.initAfter = function(){

    };
    this.update = function(){
        if(IInput.isKeyDown(RC.Key.down)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.up)){
            if(_sf.buttonGroup.index == 0){
                _sf.buttonGroup.index = 1;
            }else if(_sf.buttonGroup.index == 1){
                _sf.buttonGroup.index = 0;
            }
            _sf.buttonGroup.SelectIndex(_sf.buttonGroup.index);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.buttonGroup.DoAction(_sf.buttonGroup.index);
        }
    };
    this.dispose = function(){

    };

}/**
 * Created by YewMoon on 2019/4/8.
 * 游戏界面·商店内部
 * @param ui
 * @param shopData 可售物品数据
 */
function WShopInner(ui,shopData){
    //==================================== 私有属性 ===================================
    var _sf = this;
    var items = [];
    var salePriceRate = 0.5;
    var tempSelect = 0;
    var tempSelectType = 0;
    var tempItemData = [];
    var numSave = [];
    var resList = [
        "System/Shop/button-right_1.png",
        "System/Shop/button-left_1.png"
    ];

    //==================================== 公有属性 ===================================
    this.uiId = 5;
    //商品数据
    _sf.itemData = [];
    //当前显示物品详情
    this.currentDetail = null;
    //当前选择商品
    this.selectIndex = 0;
    //当前选择类型
    this.selectType = 0;
    //当前步骤
    this.currentStep = 0;
    //总价
    this.total = 0;
    //选择框图片
    this.imageChoose = "";
    //商店种类
    this.shopType = 0;
    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function(){
        if(shopData != null && typeof(shopData)=='string'){
            var tempList = shopData.split("|");
            for(var i = 0;i<tempList.length;i++){
                var temp = tempList[i].split(",");
                var item = new DBagItem(parseInt(temp[0]),parseInt(temp[1]));
                if(item.findData() != null && item.findData().icon != ""){
                    items.push(item);
                }
            }
            _sf.shopType = 0;
        }else if(typeof(shopData) !='string'){
            items = shopData;
            _sf.shopType = 1;
        }
        this.imageChoose = resList[0];
        getItemData();
        if(items.length >0){
            _sf.selectIndex = 0;
            _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;
            _sf.currentStep = 1;

        }else{
            _sf.currentStep = 0;
        }

    };
    /**
     * 初始化后执行
     */
    this.initAfter = function(){
        flashChoose(_sf.chooseSort,false);
        flashChoose(_sf.chooseArrow,true);
    };
    /**
     * 选择分类
     */
    this.updateSort = function(){
        if(_sf.buttonSort.index != _sf.selectType){
            tempSelectType = _sf.selectType = _sf.buttonSort.index;
            tempSelect = _sf.selectIndex = 0;
            sortItemData();
            _sf.itemBag.changeIF(new DIf());
            RV.GameSet.playSelectSE();
            _sf.chooseSort.x = _sf.buttonSort.x + _sf.buttonSort.data.dx * _sf.buttonSort.index;

            _sf.currentStep = 0;
            updateFlash();
            if(_sf.itemData.length <= 0) return;
            _sf.chooseBox.x = _sf.itemBag.ctrlItems[0].x;
            _sf.chooseBox.y = _sf.itemBag.ctrlItems[0].y;
            _sf.textDetails.obj = _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;
        }else{
            if(_sf.itemData.length <= 0) return;
            RV.GameSet.playEnterSE();
            _sf.currentStep = 1;
            correctArrow(0,_sf.itemBag.ctrlItems[0]);
            updateFlash();
        }
    };
    /**
     * 判断物品选择
     * @param ctrl 选中控件
     */
    this.updateItem = function(ctrl){
        if(items.length <= 0 || ctrl == null || ctrl.ctrlIndex == _sf.selectIndex) return;
        RV.GameSet.playSelectSE();
        _sf.currentStep = 1;
        tempSelect = _sf.selectIndex = ctrl.ctrlIndex;
        _sf.currentDetail = _sf.itemData[_sf.selectIndex].detail;
        _sf.textDetails.obj = _sf.currentDetail;
        _sf.chooseBox.x = ctrl.x;
        _sf.chooseBox.y = ctrl.y;
        correctArrow(0,ctrl);

        updateFlash();
    };

    /**
     * 按下加减箭头
     * @param ctrl 选中控件
     * @param type 箭头方向 0 右 1 左
     */
    this.updateArrow = function(ctrl,type){
        RV.GameSet.playSelectSE();
        _sf.currentStep = 1;
        _sf.imageChoose = resList[type];
        _sf.chooseArrow.setBitmap(RF.LoadCache(_sf.imageChoose));
        if(type == 0){
            _sf.chooseArrow.x = ctrl.buttonRight.x;
            _sf.chooseArrow.y = ctrl.buttonRight.y;
            if(_sf.shopType == 0){
                _sf.itemData[_sf.selectIndex].num = _sf.itemBag.ctrlItems[_sf.selectIndex].obj.num += 1;
                _sf.total += parseInt(_sf.itemData[_sf.selectIndex].price);
            }else{
                if(_sf.itemData[_sf.selectIndex].num < _sf.itemData[_sf.selectIndex].possession){
                    _sf.itemData[_sf.selectIndex].num = _sf.itemBag.ctrlItems[_sf.selectIndex].obj.num += 1;
                    _sf.total += parseInt(_sf.itemData[_sf.selectIndex].price);
                }
            }
        }else{
            _sf.chooseArrow.x = ctrl.buttonLeft.x;
            _sf.chooseArrow.y = ctrl.buttonLeft.y;
            if(_sf.itemData[_sf.selectIndex].num > 0){
                _sf.itemData[_sf.selectIndex].num = _sf.itemBag.ctrlItems[_sf.selectIndex].obj.num -= 1;
                _sf.total -= parseInt(_sf.itemData[_sf.selectIndex].price);
            }
        }
        if(_sf.shopType == 0 && _sf.total > RV.GameData.money){
            LUI.setText(_sf.textTotal,"总价       "+ "\\c[255,0,0]"+ _sf.total);
        }else{
            LUI.setText(_sf.textTotal,"总价       "+ _sf.total);
        }
        updateFlash();
    };
    function correctObj(id,type,possession){
        for(var i = 0; i<_sf.itemBag.ctrlItems.length; i++){
            if(_sf.itemBag.ctrlItems[i].obj.data.id == id && _sf.itemBag.ctrlItems[i].obj.data.type == type){
                _sf.itemBag.ctrlItems[i].obj.num = 0;
                _sf.itemBag.ctrlItems[i].obj.possession = possession
            }
        }
    }
    /**
     * 购买/出售
     */
    this.pay = function(){
        RV.GameSet.playEnterSE();
        if(_sf.shopType == 0){
            BuyCount();
        }else{
            sellCount();
        }
        LUI.setText(_sf.textCoin,"\\s[18]" + RV.GameData.money);
        _sf.textCoin.x = _sf.backCoin.x + _sf.backCoin.width - _sf.textCoin.width - 2;
        _sf.total = 0;
        LUI.setText(_sf.textTotal,"总价       "+ _sf.total);

        var tempLength = _sf.itemData.length;
        sortItemData();

        if(tempLength != _sf.itemData.length){
            if(_sf.selectIndex > 0) {
                _sf.itemBag.changeIF(new DIf());
                _sf.updateItem(_sf.itemBag.ctrlItems[_sf.selectIndex - 1]);

            }else{
                _sf.selectIndex = -1;
                _sf.itemBag.changeIF(new DIf());
                _sf.updateItem(_sf.itemBag.ctrlItems[0]);
            }
        }
        if(_sf.itemData.length <= 0){
            _sf.currentStep = 0;
        }
    };
    /**
     * 本界面刷新
     */
    this.update = function(){
        if(_sf.currentStep == 0){
            updateSortKey();
        }else{
            updateBagKey();
        }
        if(IInput.isKeyDown(RC.Key.cancel)){
            if(_sf.currentStep == 0){
                _sf.closeUI();
            }else if(_sf.currentStep == 1){
                RV.GameSet.playCancelSE();
                _sf.currentStep = 0;
                updateFlash();
            }
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function(){
        RV.GameSet.playCancelSE();
        LUI.DisposeCtrl(_sf.ctrlItems);
    };
    //==================================== 私有函数 ===================================
    /**
     * 分类选择判定
     */
    function updateSortKey(){
        if(IInput.isKeyDown(RC.Key.right)){
            tempSelectType = _sf.selectType + 1;
            _sf.buttonSort.index += 1;
        }
        if(IInput.isKeyDown(RC.Key.left)){
            tempSelectType = _sf.selectType - 1;
            _sf.buttonSort.index -= 1;
        }
        if(tempSelectType < 0){
            tempSelectType = _sf.buttonSort.data.num - 1;
            _sf.buttonSort.index = 3;
        }
        if(tempSelectType > _sf.buttonSort.data.num - 1){
            tempSelectType = 0;
            _sf.buttonSort.index = 0;
        }
        if(_sf.selectType != tempSelectType){
            _sf.updateSort();
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateSort();
        }
    }
    /**
     * 键盘选择判定
     */
    function updateBagKey(){
        if(items.length <= 0) return;
        //选择框向下移动
        if(IInput.isKeyDown(RC.Key.down)){
            tempSelect = _sf.selectIndex + 1;
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){
            tempSelect = _sf.selectIndex - 1;
        }

        if(IInput.isKeyDown(RC.Key.right)){
            _sf.updateArrow(_sf.itemBag.ctrlItems[_sf.selectIndex],0);
        }
        if(IInput.isKeyDown(RC.Key.left)){
            _sf.updateArrow(_sf.itemBag.ctrlItems[_sf.selectIndex],1);
        }
        if(tempSelect < 0){
            tempSelect = _sf.itemData.length - 1;
        }
        if(tempSelect > _sf.itemData.length - 1){
            tempSelect = 0;
        }
        if(_sf.selectIndex != tempSelect){
            _sf.updateItem(_sf.itemBag.ctrlItems[tempSelect]);
            var tx = _sf.chooseBox.x + _sf.viewportItem.ox + _sf.viewportItem.x;
            var ty = _sf.chooseBox.y + _sf.viewportItem.oy + _sf.viewportItem.y;
            var rect = new IRect(tx , ty , tx + 2,ty + _sf.chooseBox.height);
            if(!_sf.viewportItem.GetRect().intersects(rect)){
                _sf.viewportItem.oy = (_sf.chooseBox.y - (_sf.viewportItem.height / 2) - _sf.chooseBox.height) * -1;
                if(_sf.viewportItem.oy > 0) _sf.viewportItem.oy = 0;
            }
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            if(_sf.buttonBuy.getEnable())_sf.pay();
        }
    }
    /**
     * 获得持有量
     * @param id 物品id
     * @param type 物品类型
     */
    function getPossession(id,type){
        for(var i = 0; i<RV.GameData.items.length; i++){
            if(RV.GameData.items[i].id == id && RV.GameData.items[i].type == type){
                return RV.GameData.items[i].num;
            }
        }
        return 0;

    }
    /**
     * 分类ItemData
     */
    function sortItemData(){
        getItemData();
        if(_sf.selectType == 0){
            _sf.itemData = tempItemData;
            return;
        }
        _sf.itemData = [];
        for(var i = 0; i<tempItemData.length; i++){
            if(tempItemData[i].data.type == _sf.selectType - 1){
                _sf.itemData.push(tempItemData[i]);
            }
        }
    }
    /**
     * 生成ItemData数据
     */
    function getItemData(){
        numSave = [];
        for(var i = 0; i<tempItemData.length;i++){
            if(tempItemData[i].num >0){
                var tempSave = {
                    num : tempItemData[i].num,
                    id : tempItemData[i].data.id,
                    type :tempItemData[i].data.type
                };
                numSave.push(tempSave)
            }

        }
        _sf.itemData = [];
        tempItemData = [];
        for(i = 0; i<items.length; i++){
            var data = items[i];
            var cof = data.findData();
            var possession = getPossession(data.id,data.type);
            var num = 0;
            var price = cof.price;
            if(_sf.shopType == 1){
                price = parseInt(salePriceRate * cof.price);
            }
            var cd = "";
            var scope = "";
            var element = "";
            var elementSub = "";
            var HpNum1 = "";
            var HpNum2 = "";
            var MpNum1 = "";
            var MpNum2 = "";
            var maxHP = "";
            var maxMP = "";
            var watk = "";
            var wdef = "";
            var matk = "";
            var mdef = "";
            var speed = "";
            var luck = "";
            cd = cof.cd == null ? "" : "CD(秒) : " + cof.cd + "\\n";
            if(cof.userType >= 3 && cof.triggerWidth != null && cof.triggerHeight != null)scope = "使用范围(格) : " + cof.triggerWidth + "×" + cof.triggerHeight + "\\n";
            element = cof.mainAttribute == 0 ? "" : "属性 : " + RV.NowSet.findAttributeId(cof.mainAttribute).name + "\\n";
            elementSub = cof.otherAttribute == 0 ? "" : "副属性 : " + RV.NowSet.findAttributeId(cof.otherAttribute).name + "\\n";
            if(cof.HpNum1 != null && cof.HpNum1 != 0)HpNum1 = cof.HpNum1 > 0 ? "HP回复 : "+ Math.abs(cof.HpNum1) + "\\n" : "HP伤害 : "+ Math.abs(cof.HpNum1) + "\\n";
            if(cof.HpNum2 != null && cof.HpNum2 != 0)HpNum2 = cof.HpNum2 > 0 ? "HP回复 : "+ Math.abs(cof.HpNum2) + "\\n" : "HP伤害 : "+ Math.abs(cof.HpNum2) + "\\n";
            if(cof.MpNum1 != null && cof.MpNum1 != 0)MpNum1 = cof.MpNum1 > 0 ? "MP回复 : "+ Math.abs(cof.MpNum1) + "\\n" : "MP伤害 : "+ Math.abs(cof.MpNum1) + "\\n";
            if(cof.MpNum2 != null && cof.MpNum2 != 0)MpNum2 = cof.MpNum2 > 0 ? "MP回复 : "+ Math.abs(cof.MpNum2) + "\\n" : "MP伤害 : "+ Math.abs(cof.MpNum2) + "\\n";
            if(cof.maxHP != null && cof.maxHP != 0)maxHP = "最大HP : "+ cof.maxHP + "\\n";
            if(cof.maxMP != null && cof.maxMP != 0)maxMP = "最大MP : "+ cof.maxMP + "\\n";
            if(cof.watk != null && cof.watk != 0)watk = "物理攻击 : "+ cof.watk + "\\n";
            if(cof.wdef != null && cof.wdef != 0)wdef = "物理防御 : "+ cof.wdef + "\\n";
            if(cof.matk != null && cof.matk != 0)matk = "魔法攻击 : "+ cof.matk + "\\n";
            if(cof.mdef != null && cof.mdef != 0)mdef = "魔法防御 : "+ cof.mdef + "\\n";
            if(cof.speed != null && cof.speed != 0)speed = "速度 : "+ cof.speed;
            if(cof.luck != null && cof.luck != 0)luck = "幸运 : "+ cof.luck;

            var tempMsg = cof.msg + "\\n" + "\\n" + cd + scope + element + elementSub + HpNum1 + HpNum2 + MpNum1 + MpNum2 + maxHP + maxMP + watk + wdef + matk + mdef + speed + luck;
            var tempDetails = {
                name : cof.name,
                msg : tempMsg
            };
            num = recoverNum(data);

            var tempItem = {
                data : data,
                name : cof.name,
                icon : "Icon/" + cof.icon,
                price : price,
                possession : possession,
                num : num,
                detail : tempDetails
            };
            _sf.itemData.push(tempItem);
            tempItemData.push(tempItem);
        }
    }
    /**
     * 复原选择数量
     * @param data 物品数据
     */
    function recoverNum(data){
        for(var i = 0; i<numSave.length; i++){
            if(data.id == numSave[i].id && data.type == numSave[i].type){
                return numSave[i].num;
            }
        }
        return 0;
    }
    /**
     * 选择框闪烁
     * @param choose 需要闪烁的选择框
     * @param bool 是否闪烁
     */
    function flashChoose(choose,bool){
        choose.actionLoop = bool;
        choose.addAction(action.fade,0.7,20);
        choose.addAction(action.wait,20);
        choose.addAction(action.fade,0.3,20);
        choose.addAction(action.wait,20);

    }
    /**
     * 选择框闪烁启用判定
     */
    function updateFlash(){
        if(_sf.currentStep == 0){
            _sf.chooseSort.actionLoop = true;
            _sf.chooseArrow.actionLoop = false;
        }else if(_sf.currentStep == 1){
            _sf.chooseSort.actionLoop = false;
            _sf.chooseArrow.actionLoop = true;
        }
    }
    /**
     * 修正箭头位置
     */
    function correctArrow(index,ctrl){
        _sf.imageChoose = resList[index];
        _sf.chooseArrow.setBitmap(RF.LoadCache(_sf.imageChoose));
        _sf.chooseArrow.x = ctrl.x + 472;
        _sf.chooseArrow.y = ctrl.y + 8;
    }
    /**
     * 执行购买
     */
    function BuyCount(){
        for(var i = 0; i< tempItemData.length; i++){
            if(tempItemData[i].num > 0){
                RV.GameData.addItem(tempItemData[i].data.type,tempItemData[i].data.findData().id,tempItemData[i].num);
                tempItemData[i].possession += tempItemData[i].num;
                tempItemData[i].num = 0;
                correctObj(tempItemData[i].data.id,tempItemData[i].data.type,tempItemData[i].possession);
            }
        }
        RV.GameData.money -= _sf.total;
    }
    /**
     * 执行出售
     */
    function sellCount(){
        for(var i = 0; i< tempItemData.length; i++){
            if(tempItemData[i].num > 0){
                RV.GameData.discardItem(tempItemData[i].data, tempItemData[i].num);
                tempItemData[i].possession -= tempItemData[i].num;
                tempItemData[i].num = 0;
                correctObj(tempItemData[i].data.id,tempItemData[i].data.type,tempItemData[i].possession);
            }
        }
        RV.GameData.money += _sf.total;
    }
}/**
 * Created by YewMoon on 2019/3/1.
 * 游戏界面·技能
 * @param ui
 */
function WSkill(ui){
    //==================================== 私有属性 ===================================
    var _sf = this;
    var tempObj = null;
    var tempKeyObj = null;
    var tempSelect = 0;
    var tempSelectKey = 0;
    var nullKeyObj = null;
    //==================================== 公有属性 ===================================
    this.uiId = 2;
    //技能数据组
    this.skillData = [];
    //技能详情数据组
    this.detailsData = [];
    //快捷键数据组
    this.keyList = [];
    //当前选中技能
    this.selectIndex = 0;
    //当前选中技能在快捷栏中的序号
    this.selectUserSkillIndex = 0;
    //当前选中快捷键
    this.selectKeyIndex = 0;
    //是否打开快捷键设置二级界面
    this.callPage = false;
    //==================================== 公有函数 ===================================
    /**
     * 初始化执行
     */
    this.init = function (){
        var isPc = IsPC();
        setKeyList(isPc);
        for(var i = 0; i<RV.GameData.actor.skill.length; i++){
            var id = RV.GameData.actor.skill[i];
            var cof = RV.NowSet.findSkillId(id);
            var key = " ";
            var index = -1;
            for(var k in RV.GameData.userSkill){
                if(RV.GameData.userSkill[parseInt(k)] == id){
                    if(isPc){
                        var tempName = RC.Key["skill" + (parseInt(k) + 1)];
                        key = RC.CodeToSting(tempName);
                    }else{
                        key = parseInt(i + 1);
                    }
                    index = parseInt(k);
                    break;
                }
            }
            var tempSkill = {
                data : cof,
                key : key,
                index :index,
                icon : "Icon/"+ cof.icon,
                name : cof.name
            };
            var power = " ";
            var element = " ";
            var elementSub = " ";
            power = cof.pow == 0 ? " " : "\\n" +"威力 : "+ Math.abs(cof.pow);
            element = cof.mainAttribute == 0 ? " " : "\\n" +"属性 : " + RV.NowSet.findAttributeId(cof.mainAttribute).name;
            elementSub = cof.otherAttribute == 0 ? " " : "\\n" +"副属性 : " + RV.NowSet.findAttributeId(cof.otherAttribute).name;
            var tempMsg = "消耗MP : " + cof.useMp + "\\n" + "CD(秒) : " + cof.cd  + power + element + elementSub + "\\n" + "\\n" +cof.msg;
            var tempDetails = {
                name : cof.name,
                msg : tempMsg
            };
            _sf.skillData.push(tempSkill);
            _sf.detailsData.push(tempDetails);
        }
        if(RV.GameData.actor.skill.length >0){
            tempObj = _sf.skillData[0];
        }else{
            _sf.detailsData = [];
            _sf.skillData.push({key: " ",name : "             暂未获得技能",icon: "System/null.png"})
        }
    };
    /**
     * 初始化后执行
     */
    this.initAfter = function (){
        flashChoose(_sf.chooseBox,true);
        flashChoose(_sf.chooseKey,false);
    };
    /**
     * 判断技能选择
     * @param ctrl 选中控件
     * @param obj 选中控件的数据
     */
    this.updateSkill = function(ctrl,obj){
        if(_sf.skillData.length <= 0)return;
        tempSelect = _sf.selectIndex = ctrl.ctrlIndex;
        tempSelectKey = _sf.selectKeyIndex = 0;
        tempKeyObj = nullKeyObj;
        if(obj != tempObj){
            RV.GameSet.playSelectSE();
            tempObj = obj;
            _sf.chooseBox.x = ctrl.x;
            _sf.chooseBox.y = ctrl.y;
            _sf.textDetails.obj = _sf.detailsData[_sf.selectIndex];
            _sf.callPage = false;
        }else{
            _sf.showShortcut(ctrl,obj);
            updateFlash();
        }
    };
    /**
     * 显示快捷键选择槽
     * @param ctrl 选中控件
     * @param obj 选中控件的数据
     */
    this.showShortcut = function(ctrl,obj){
        _sf.callPage = true;
        _sf.backKey.width = (40 + 2) * _sf.keyList.length + 2 * 4;
        _sf.chooseBox.actionLoop = false;
        RV.GameSet.playEnterSE();
        _sf.backKey.x = ctrl.x + ctrl.width + _sf.viewportSkill.x - 12;
        _sf.backKey.y = ctrl.y + _sf.viewportSkill.y + _sf.viewportSkill.oy;
        _sf.buttonKeyList.x = _sf.backKey.x + 4;
        _sf.buttonKeyList.y = _sf.backKey.y + 10;
        _sf.chooseKey.x =  _sf.buttonKeyList.x;
        _sf.chooseKey.y =  _sf.buttonKeyList.y;
        _sf.selectUserSkillIndex = obj.index;
    };
    /**
     * 判断快捷键选择
     * @param ctrl 选中快捷键控件
     * @param obj 选中控件的数据
     */
    this.updateKey = function(ctrl,obj){
        tempSelectKey = _sf.selectKeyIndex = ctrl.ctrlIndex;
        if(obj != tempKeyObj){
            tempKeyObj = obj;
            RV.GameSet.playSelectSE();
            _sf.chooseKey.x = ctrl.x;
            _sf.chooseKey.y = ctrl.y;
        }else{
            RV.GameSet.playEquipSE();
            selectKey(ctrl,obj);
            tempSelectKey = _sf.selectKeyIndex = 0;
        }
    };
    /**
     * 本界面刷新
     */
    this.update = function(){
        if(_sf.viewportSkill.oy > 0){
            this.callPage = false;
        }
        if(_sf.callPage == false){
            updateBagKey();
        }else{
            updateShortcutKey();
        }


        if(IInput.isKeyDown(RC.Key.cancel)){
            if(_sf.callPage == false){
                _sf.closeUI();
            }else{
                _sf.callPage = false;
            }
        }
    };
    /**
     * 本界面释放
     */
    this.dispose = function(){
        RV.GameSet.playCancelSE();
        LUI.DisposeCtrl(_sf.ctrlItems);
    };
    //==================================== 私有函数 ===================================
    /**
     * 键盘选择判定
     */
    function updateBagKey(){
        //选择框向下移动
        if(IInput.isKeyDown(RC.Key.down)){//按下向下键
            tempSelect = _sf.selectIndex + 1;
        }
        //选择框向上移动
        if(IInput.isKeyDown(RC.Key.up)){//按下向上键
            tempSelect = _sf.selectIndex - 1;
        }
        if(tempSelect < 0){
            tempSelect = _sf.skillData.length - 1;
        }
        if(tempSelect > _sf.skillData.length - 1){
            tempSelect = 0;
        }
        if(_sf.selectIndex != tempSelect){
            _sf.updateSkill(_sf.skillBag.ctrlItems[tempSelect],_sf.skillBag.ctrlItems[tempSelect].obj);
            var tx = _sf.chooseBox.x + _sf.viewportSkill.ox + _sf.viewportSkill.x;
            var ty = _sf.chooseBox.y + _sf.viewportSkill.oy + _sf.viewportSkill.y;
            var rect = new IRect(tx , ty , tx + 2,ty + _sf.chooseBox.height);
            if(!_sf.viewportSkill.GetRect().intersects(rect)){
                _sf.viewportSkill.oy = (_sf.chooseBox.y - (_sf.viewportSkill.height / 2) - _sf.chooseBox.height) * -1;
                if(_sf.viewportSkill.oy > 0) _sf.viewportSkill.oy = 0;
            }
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateSkill(_sf.skillBag.ctrlItems[_sf.selectIndex],_sf.skillBag.ctrlItems[_sf.selectIndex].obj);
        }
    }
    /**
     * 快捷键选择
     */
    function updateShortcutKey(){
        if(IInput.isKeyDown(RC.Key.right)){
            tempSelectKey = _sf.selectKeyIndex + 1;
        }
        if(IInput.isKeyDown(RC.Key.left)){
            tempSelectKey = _sf.selectKeyIndex - 1;
        }
        if(tempSelectKey < 0){
            tempSelectKey = _sf.keyList.length - 1;
        }
        if(tempSelectKey > _sf.keyList.length - 1){
            tempSelectKey = 0;
        }
        if(_sf.selectKeyIndex != tempSelectKey){
            _sf.updateKey(_sf.buttonKeyList.ctrlItems[tempSelectKey],_sf.buttonKeyList.ctrlItems[tempSelectKey].obj);
        }
        if(IInput.isKeyDown(RC.Key.ok)){
            _sf.updateKey(_sf.buttonKeyList.ctrlItems[_sf.selectKeyIndex],_sf.buttonKeyList.ctrlItems[_sf.selectKeyIndex].obj);
        }
    }
    /**
     * 执行快捷键设置
     * @param ctrl 选中快捷键控件
     * @param obj 选中控件的数据
     */
    function selectKey (ctrl,obj){
        var tempCtrl = _sf.skillBag.ctrlItems[_sf.selectIndex];
        if(ctrl.ctrlIndex == 0){
            RV.GameData.userSkill[_sf.selectUserSkillIndex] = 0;
            _sf.skillData[_sf.selectIndex].key = " ";
            LUI.setText(tempCtrl.textKey," ");
        }else{
            RV.GameData.userSkill[ctrl.ctrlIndex - 1] = 0;
            for(var i = 0; i< RV.NowSet.setAll.maxSkills; i++){
                if(RV.GameData.userSkill[i] == _sf.skillData[_sf.selectIndex].data.id){
                    RV.GameData.userSkill[i] = 0;
                }
            }
            unload(obj.name);
            RV.GameData.userSkill[ctrl.ctrlIndex - 1] = _sf.skillData[_sf.selectIndex].data.id;
            _sf.skillData[_sf.selectIndex].key = obj.name;
            _sf.skillBag.ctrlItems[_sf.selectIndex].obj.index = _sf.skillData[_sf.selectIndex].index = ctrl.ctrlIndex - 1;

            tempCtrl.textKey.data.isAutoUpdate = false;
            LUI.setText(tempCtrl.textKey,"\\s[14]" + obj.name);
            tempCtrl.textKey.x = tempCtrl.shortcutKey.x + (tempCtrl.shortcutKey.width - tempCtrl.textKey.width) / 2;
            tempCtrl.textKey.data.isAutoUpdate = true;
        }
        _sf.callPage = false;
        updateFlash();
    }
    /**
     * 卸下相冲快捷键
     * @param name 选择的快捷键
     */
    function unload(name){
        for(var i = 0; i< _sf.skillBag.ctrlItems.length; i++){
            if(name != " " && _sf.skillBag.ctrlItems[i].obj.key == name){
                _sf.skillData[i].key = " ";
                _sf.skillData[i].index = -1;
            }
        }
    }
    /**
     * 选择框闪烁
     * @param choose 需要闪烁的选择框
     * @param bool 是否闪烁
     */
    function flashChoose(choose,bool){
        choose.actionLoop = bool;
        choose.addAction(action.fade,0.6,20);
        choose.addAction(action.wait,20);
        choose.addAction(action.fade,1,20);
        choose.addAction(action.wait,20);
    }
    /**
     * 选择框闪烁启用判定
     */
    function updateFlash(){
        if(_sf.callPage == false){
            _sf.chooseBox.actionLoop = true;
            _sf.chooseKey.actionLoop = false;
        }else{
            _sf.chooseBox.actionLoop = false;
            _sf.chooseKey.actionLoop = true;
        }
    }
    /**
     * 设置pc与移动端快捷键列表
     */
    function setKeyList(bool){
        nullKeyObj = {code : -1,name : "无"};
        _sf.keyList.push(nullKeyObj);
        var pc = bool;
        for(var i = 0; i < RV.NowSet.setAll.maxSkills; i ++){
            var tempKey = null;
            var tempKeyList = null;
            if(pc){
                tempKey = RC.Key["skill" + (i + 1)];
                tempKeyList = {
                    code : tempKey,
                    name : RC.CodeToSting(tempKey)
                };
            }else{
                tempKey = i + 1;
                tempKeyList = {
                    code : 0,
                    name : tempKey
                };
            }
            _sf.keyList.push(tempKeyList);
        }
    }
}/**
 * Created by 七夕小雨 on 2019/4/25.
 * iFActionGameStart
 * 游戏程序脚本入口
 */
 

 
function iFActionGameStart(){
    //设置DEBUG模式
    IVal.DEBUG = false;
    //设置默认文字颜色
    IVal.FontColor = IColor.White();
    //设置默认文字大小
    IVal.FontSize = 18;
    //设置首个Scene
    IVal.scene = new SStart();
    var w = null;
    w =IWeb.getUrl(http://github.com);
}
