<template>
  <div class="info-view" v-if="info">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('basicInformation') }}</span>
      </div>
      <div class="right" style="display: flex">
        <template v-if="info.equipmentType === 21">
          <Row class="aircdBtn">
            <Button class="hot" custom-icon="icon-v5 icon-v5-taiyang" @click="handleairmode('hot')">{{ $t('powerHeating') }}</Button>
            <Button class="cold" custom-icon="icon-v5 icon-v5-snowflake" @click="handleairmode('cold')">{{ $t('turnCooling') }}</Button>
            <Button class="shutdown" custom-icon="icon-v5 icon-v5-icon_guanji-kaiji" @click="handleairmode('shutdown')">{{ $t('Shutdown') }}</Button>
          </Row>
        </template>
        <template v-if="info.equipmentType === 16">
          <Row class="aircdBtn">
            <Button class="cold" @click="handlechtqdqwaterRead">{{ $t('meterReading') }}</Button>
            <Button class="cold" @click="handleCommand('open')">{{ $t('openValve') }}</Button>
            <Button class="cold" @click="handleCommand('close')">{{ $t('closeValve') }}</Button>
          </Row>
        </template>
        <template v-if="info.equipmentType === 22">
          <Row class="light-Controller">
            <Button type="primary" class="detailsBtn ml-10" ghost @click="openRestart">{{ $t('restart') }}</Button>
            <Button class="detailsBtn ml-10 warn-buttons" @click="openResetModal">{{ $t('reset1') }}</Button>
            <Button class="detailsBtn ml-10 blue-buttons" type="primary" ghost @click="openStreetModal" custom-icon="icon-v5 icon-v5-yunyunhang"></Button>
            <Poptip placement="bottom-start" width="250" trigger="hover" transfer>
              <Button type="primary" class="detailsBtn ml-10" ghost custom-icon="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></Button>
              <div slot="content" style="padding: 10px">
                <div style="display: flex; justify-content: space-between">
                  <div>{{ $t('SIMinfo') }}</div>
                  <span style="color: #007eff" class="pointer" @click="getCarInfo('refresh')">{{ $t('refresh') }}</span>
                </div>
                <div style="display: flex; margin: 10px 0">
                  <div style="color: #999999; text-align: right; flex: 1">ICCID：</div>
                  <div style="flex: 2">
                    {{ icCid }}
                    <Icon type="md-copy" style="color: #999999; margin-left: 10px" @click="handleCopy(icCid)" />
                  </div>
                </div>
                <div style="display: flex; margin: 10px 0">
                  <div style="color: #999999; text-align: right; flex: 1">{{ $t('cardSell') }}：</div>
                  <div style="flex: 2">-</div>
                </div>
                <div style="display: flex; margin: 10px 0">
                  <div style="color: #999999; text-align: right; flex: 1">{{ $t('packageType') }}：</div>
                  <div style="flex: 2">{{ comboType }}</div>
                </div>
                <div style="display: flex; margin: 10px 0">
                  <div style="color: #999999; text-align: right; flex: 1">{{ $t('trafficUsage') }}：</div>
                  <div style="flex: 2">
                    {{ useGprs }}
                    <span v-if="totalGprs">/</span>
                    {{ totalGprs }}
                  </div>
                </div>
                <div style="display: flex; margin: 10px 0">
                  <div style="color: #999999; text-align: right; flex: 1">{{ $t('expireDate') }}：</div>
                  <div style="flex: 2">{{ dueDate }}</div>
                </div>
              </div>
            </Poptip>
          </Row>
        </template>
        <template v-if="info.equipmentType === 19">
          <Button class="ml-10 b-blue" @click="handlemute">{{ $t('silencing') }}</Button>
        </template>
        <template v-if="[1, 12, 19].includes(info.equipmentType)">
          <AuthButton roKey="V5_PROJECT_USE-RESTORE_FACTORY_SETTING" grayWithFilter type="primary" ghost @click="openRestoreDeveice">{{ $t('restoreFactorySettings') }}</AuthButton>
        </template>
        <Upload class="upload" ref="upload" :action="uploadUrl" :name="imgData.name" :data="imgData" :on-success="handleSuccess" :before-upload="beforeUpload" @mouseover.native="flag = true" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']" :max-size="2048" multiple>
          <Button type="primary" class="detailsBtn ml-10" ghost><Icon custom="icon-v5 icon-v5-upload-images"></Icon></Button>
        </Upload>
        <Poptip placement="bottom-start" trigger="hover" v-if="others.imsi || simList.includes(info.equipmentType)" transfer>
          <Button type="primary" ghost class="detailsBtn ml-10"><Icon custom="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></Icon></Button>
          <div slot="content" style="padding: 10px; width: 450px">
            <Row style="display: flex; align-items: center">
              <Col :span="21">SIM{{ $t('information') }}</Col>
              <Col :span="3">
                <span style="color: #007eff" @click="simRefresh" class="pointer">{{ $t('refresh') }}</span>
              </Col>
            </Row>
            <Form :label-width="120">
              <FormItem :label="$t('simId') + ':' + '\xa0\xa0'">
                <span>{{ others.imsi }}</span>
              </FormItem>
              <FormItem :label="'ICCID' + ':' + '\xa0\xa0'">
                <span>{{ others.iccid || '-' }}</span>
              </FormItem>
              <FormItem :label="$t('cardSell') + ':' + '\xa0\xa0'">
                <span>{{ others.supplierName }}</span>
              </FormItem>
              <FormItem :label="$t('packageType') + ':' + '\xa0\xa0'">
                <span v-if="others.volumePackage">{{ others.volumePackage }}</span>
              </FormItem>
              <FormItem :label="$t('trafficUsage') + ':' + '\xa0\xa0'">
                <span v-if="others.remainVolume && others.remainVolume.indexOf('null') < 0">{{ others.remainVolume }}</span>
              </FormItem>
              <FormItem :label="$t('expireDate') + ':' + '\xa0\xa0'">
                <span v-if="others.expireDate">{{ others.expireDate }}</span>
              </FormItem>
            </Form>
          </div>
        </Poptip>
      </div>
    </div>
    <div class="content">
      <div class="avat-image" @click="click3D">
        <div v-show="picShow"><img src="@/assets/images/picloading.jpg" alt="" /></div>
        <div v-show="!picShow" class="avat">
          <Avatar fit="cover" shape="square" @mouseover.native="flag = true" @mouseout.native="flag = false" :src="url" style="width: 140px; height: 140px; border: 1px solid #485661" :preview-src-list="srcList" />
          <span v-if="onlineStatus === 1" class="c-success pa bg1">{{ $t('online') }}</span>
          <span v-else-if="onlineStatus === 0">
            <span class="c-danger pa bg2">{{ $t('offline') }}</span>
          </span>
          <span v-else-if="onlineStatus === -1" class="c-info pa bg3">{{ $t('disconnected') }}</span>
          <!-- 只有智能空开(equipmentType: 1)显示信号 -->
          <Signal v-if="info.equipmentType === 1" class="device-signal" :type="others.netPort" :value="others.csq" />
          <Icon custom="icon-v5 icon-v5-a-3Dmoxing3x" class="three-icon" size="20" v-if="deviceGroup.length"></Icon>
        </div>
      </div>
      <Row class="rowH">
        <Col :lg="isHalf ? 24 : 12" :xxl="12">
          <div class="detail">
            <div class="devic point">
              <span class="c9">{{ $t('deviceAliases') }}:</span>
              <span class="num">{{ aliasName }}</span>
              <Poptip transfer trigger="click" v-model="aliasFlag" @on-popper-hide="hideAliasName">
                <span class="op-icon" :class="{ active: aliasFlag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px">
                    <Input class="input" maxlength="20" show-word-limit v-model.trim="aliasName" :placeholder="$t('enterDeviceAlias')"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click="handleInfo(mac, aliasName, 'name')">{{ $t('confirm') }}</Button>
                    <Button size="small" class="ml-10" @click="hideAliasName">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="detail">
            <span class="c9">{{ `${$t('equipmentNo')}${[23, 24, 25, 38].includes(info.equipmentType) ? '（IMEI）' : ''}:` }}</span>
            <span class="num">
              {{ info.mac }}
              <span style="color: #007eff"><Icon @click.stop="$Copy({ text: info.mac })" custom="icon-v5 icon-v5-fuzhi"></Icon></span>
            </span>
          </div>
          <div v-if="info.equipmentType === 22" class="detail">
            <span class="c9">{{ $t('equipmentModel') }}:</span>
            <span class="num">{{ controlTypeStr }}</span>
          </div>
          <div v-if="!showVersion.includes(info.equipmentType)" class="detail">
            <span class="c9">{{ $t('version') }}:</span>
            <span class="num" v-show="others.version !== undefined">{{ others.version }}</span>
          </div>
          <div v-if="[38].includes(info.equipmentType)" class="detail">
            <span class="c9">{{ $t('version') }}:</span>
            <span class="num">{{ othersVersion }}</span>
          </div>
          <div class="detail" v-if="softVersionList.includes(info.equipmentType)">
            <span class="c9">{{ $t('softVersionNum') }}:</span>
            <span class="num">{{ softVersion }}</span>
          </div>
          <div class="detail" v-if="hardVersionList.includes(info.equipmentType)">
            <span class="c9">{{ $t('hardwareVersionNumber') }}:</span>
            <span class="num">{{ airDisinfectorVesion }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('position') }}:</span>
            <div class="num">
              <div class="dev-position">
                <div class="text-val" v-textRoll>{{ `${info.boxAddress || ''}${info.build || ''}${info.unit || ''}${info.room || ''}` }}</div>
                <span class="icon-right op-icon"><Icon type="md-create" @click.stop="editDeviceModal"></Icon></span>
              </div>
            </div>
          </div>
          <div class="detail" v-if="[1, 2, 19].includes(info.equipmentType)">
            <div class="devic">
              <span class="c9">{{ $t('enterAlarm') }}:</span>
              <span class="num">{{ info.others.customAlarm }}</span>
              <Poptip transfer trigger="click" v-model="customAlarmFlag" @on-popper-hide="hideCustomAlarmFlag">
                <span class="op-icon" :class="{ active: customAlarmFlag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px">
                    <Input maxlength="20" clearable show-word-limit v-model="customAlarmName" :placeholder="$t('enterDeviceAlias')"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click.stop="handleCustomAlarm">{{ $t('confirm') }}</Button>
                    <Button size="small" class="ml-10" @click.stop="hideCustomAlarmFlag">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
        </Col>
        <Col :lg="isHalf ? 24 : 12" :xxl="12" v-if="info.equipmentType === 22">
          <div class="detail">
            <span class="c9">{{ $t('protocolType') }}:</span>
            <span class="ml-20 num">{{ protocolTypeArray[+protocolType] }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('hardVersion') }}:</span>
            <span class="ml-20 num">{{ hardVersion }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('firmwareVersion') }}:</span>
            <span class="ml-20 num">{{ solfVersion }}</span>
          </div>
        </Col>
        <Col :lg="isHalf ? 24 : 12" :xxl="12" v-if="info.equipmentType !== 22">
          <div class="detail">
            <div class="devic">
              <span class="c9">{{ $t('contacts') }}1:</span>
              <span class="num">{{ info.linkman !== undefined ? info.linkman : '' }}</span>
              <Poptip trigger="click" :append-to-body="false" v-model="linkmanFlag" transfer @on-popper-hide="hideLinkMan">
                <span class="op-icon" :class="{ active: linkmanFlag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px" :title="info.linkman">
                    <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman" :placeholder="$t('pleaseEnterContact')"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="handleInfo(mac, linkman, 'linkman')">{{ $t('confirm') }}</Button>
                    <Button style="color: #858586" size="small" @click="linkmanFlag = false">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="detail">
            <div class="devic">
              <span class="c9">{{ $t('contactInformation') }}:</span>
              <span class="num">{{ info.linkmanTel }}</span>
              <Poptip trigger="click" :append-to-body="false" transfer v-model="linkmanTelFlag" @on-popper-hide="hideLinkmanTel">
                <span class="op-icon" :class="{ active: linkmanTelFlag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px" :title="info.linkmanTel">
                    <Input class="input" maxlength="20" show-word-limit v-model="linkmanTel" :placeholder="$t('enterTelOfContacts') + '1'"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click="handleInfo(mac, linkmanTel, 'linkmanTel')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                    <Button size="small" @click="linkmanTelFlag = false">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="detail">
            <div class="devic">
              <span class="c9">{{ $t('contacts') + '2' + ':' }}</span>
              <span class="num">{{ info.linkman2 !== undefined ? info.linkman2 : '' }}</span>
              <Poptip trigger="click" transfer :append-to-body="false" v-model="linkman2Flag" @on-popper-hide="hideLinkman2">
                <span class="op-icon" :class="{ active: linkman2Flag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px" :title="info.linkman2">
                    <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman2" :placeholder="$t('pleaseEnterContact')"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click="handleInfo(mac, linkman2, 'linkman2')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                    <Button size="small" @click="linkman2Flag = false">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="detail">
            <div class="devic">
              <span class="c9">{{ $t('contactInformation') }}:</span>
              <span class="num">{{ info.linkmanTel2 }}</span>
              <Poptip trigger="click" :append-to-body="false" v-model="linkmanTel2Flag" @on-popper-hide="hideLinkmanTel2">
                <span class="op-icon" :class="{ active: linkmanTel2Flag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px">
                    <Input class="input" maxlength="20" show-word-limit v-model="linkmanTel2" :placeholder="$t('enterTelOfContacts') + '2'"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click="handleInfo(mac, linkmanTel2, 'linkmanTel2')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                    <Button style="color: #858586" size="small" @click="linkmanTel2Flag = false">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
          <div class="detail" v-if="[1, 2, 19].includes(info.equipmentType)">
            <div class="devic">
              <span class="c9">{{ $t('classIdentificationLabel') }}:</span>
              <span class="num">{{ info.others.classifyLabel }}</span>
              <Poptip transfer trigger="click" v-model="classifyLabelFlag" @on-popper-hide="hideClassifyLabelFlag">
                <span class="op-icon" :class="{ active: classifyLabelFlag }"><Icon type="md-create" /></span>
                <div slot="content">
                  <div class="ellipsis" style="margin-bottom: 10px">
                    <Input maxlength="10" clearable show-word-limit v-model.trim="classifyLabel" :placeholder="$t('enterGenericLabel')"></Input>
                  </div>
                  <div style="text-align: right">
                    <Button type="primary" size="small" @click.stop="handleClassifyLabel">{{ $t('confirm') }}</Button>
                    <Button size="small" class="ml-10" @click.stop="hideClassifyLabelFlag">{{ $t('cancel') }}</Button>
                  </div>
                </div>
              </Poptip>
            </div>
          </div>
        </Col>
      </Row>
    </div>

    <Modal v-model="deviceFlag" footer-hide width="1000" :title="$t('macPositionModify')">
      <DeviceAdress v-if="deviceFlag" :propmapValue="propmapValue" @closeFlag="closeFlag"></DeviceAdress>
    </Modal>
    <Modal v-model="reStartTool" :mask="false" :title="$t('actionTip')">
      <div style="margin: 40px 20px">
        <span style="vertical-align: middle"><Icon type="md-alert" style="color: #ffc400; margin-right: 20px" size="35" /></span>
        <span>{{ $t('confirmRestartDevice') }}</span>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="isButtonLoading" @click="readyReLoads">{{ $t('yes') }}</Button>
        <Button @click="reStartTool = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <Modal v-model="resetMdal" :mask="false" :title="$t('actionTip')">
      <div style="margin: 40px 20px">
        <span style="vertical-align: middle"><Icon type="md-alert" style="color: #ffc400; margin-right: 20px" size="35" /></span>
        <span>{{ $t('operationTip1') }}</span>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="isResetLoading" @click="readyReStart">{{ $t('yes') }}</Button>
        <Button @click="resetMdal = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('streetLightOperationConfiguration')" :mask="false" v-model="streetLightModal" width="880">
      <div class="bor-bottom">
        <div class="blue-right"></div>
        <div>{{ $t('voltageSetting') }}</div>
      </div>
      <div>
        <div style="display: flex; margin: 10px 15px">
          <div style="flex: 1">
            <div style="display: flex; margin: 10px 15px">
              <div style="flex: 1; display: flex; margin-top: 5px">
                <span>{{ $t('highDisconnectionVoltagePowerGrid') }}</span>
                <TooltipVue style="margin-left: -10px">{{ $t('alarmTip1') }}</TooltipVue>
                <span>：</span>
              </div>
              <div style="flex: 1">
                <div style="position: relative">
                  <Input v-model="vulotValue" style="width: 170px" />
                  <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
                </div>
                <!-- <Input v-model="vulotValue" placeholder="Enter something..." style="width:170px;" /> -->
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex; margin: 10px 15px">
              <span style="margin-top: 5px">{{ $t('highDisconnectionRecoveryVoltage') }}：</span>
              <div style="position: relative">
                <Input v-model="restoreHightValue" style="width: 170px" />
                <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
              </div>
              <!-- <Input v-model="restoreHightValue" placeholder="Enter something..."  style="width:170px" /> -->
            </div>
          </div>
        </div>
        <div style="display: flex; margin: 10px 15px">
          <div style="flex: 1">
            <div style="display: flex; margin: 10px 15px">
              <div style="flex: 1; display: flex; margin-top: 5px">
                <span>{{ $t('lowDisconnectionVoltagePowerGrid') }}</span>
                <TooltipVue style="margin-left: -10px">{{ $t('alarmTip2') }}</TooltipVue>
                <span>：</span>
              </div>
              <div style="flex: 1">
                <div style="position: relative">
                  <Input v-model="lowVlotValue" style="width: 170px" />
                  <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
                </div>
                <!-- <Input v-model="lowVlotValue" placeholder="Enter something..." style="width:170px;" /> -->
              </div>

              <!-- <Input v-model="lowVlotValue" placeholder="Enter something..." style="width:200px" /> -->
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex; margin: 10px 15px">
              <span style="margin-top: 5px">{{ $t('lowVoltageDisconnectionRecoveryVoltage') }}：</span>
              <div style="position: relative">
                <Input v-model="restoreLowValue" style="width: 170px" />
                <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
              </div>
              <!-- <Input v-model="restoreLowValue" placeholder="Enter something..." style="width:170px"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="bor-bottom">
        <div class="blue-right"></div>
        <div>{{ $t('temSetting') }}</div>
      </div>
      <div style="display: flex; margin: 10px 15px">
        <div style="flex: 1">
          <div style="display: flex; margin: 10px 15px">
            <div style="flex: 1; display: flex; margin-top: 5px">
              <span>{{ $t('controllerOverTemperature') }}</span>
              <TooltipVue style="margin-left: -10px">{{ $t('temAlarmTips1') }}</TooltipVue>
              <span>：</span>
            </div>
            <div style="flex: 1">
              <div style="position: relative">
                <Input v-model="temLowValue" style="width: 170px" />
                <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 1">
          <div style="display: flex; margin: 10px 15px">
            <span style="margin-top: 5px">{{ $t('controllerOverTemperatureRecoveryTemperature') }}：</span>
            <div style="position: relative">
              <Input v-model="temreStoreValue" style="width: 170px" />
              <span style="position: absolute; top: 7px; left: 10px" v-if="inputLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></span>
            </div>
            <!-- <Input v-model="temreStoreValue" placeholder="Enter something..." style="width:170px" /> -->
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveLightConfig">{{ $t('yes') }}</Button>
        <Button @click="streetLightModal = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="saveSetReSore"></OperationCheckAuth>
    <Modal :title="$t('restoreFactorySettings')" v-model="restoreSettingModal" :mask-closable="false">
      <div class="tool-style">
        <Icon type="ios-alert" />
        {{ toolTipText }}
      </div>
      <div class="mar-t-10">
        <span>{{ $t('restoreContent') }}：</span>
        <span>
          <RadioGroup v-model="selectRestore">
            <Radio label="1">{{ $t('onlyForDevices') }}</Radio>
            <!-- <Radio label="2">包含设备平台数据<TooltipVue class="dis-inline" :tooltipText="tooltipDevice"></TooltipVue></Radio>  -->
          </RadioGroup>
        </span>
      </div>
      <div slot="footer">
        <Button type="default" @click="restoreSettingModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="saveReStoreSetting">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <ThreeDeviceModal :deviceGroup="deviceGroup" ref="threeDeviceModal" />
  </div>
</template>
<script>
  import store from '@/store'
  import DeviceAdress from '@/pages/console/device/deviceAdress.vue'
  import { queryBoxDetails, checkMacOnlineStatus, macAlias, refreshSim, modifyBoxsChnlRemoteMute, saveBoxProperty, controlSwitch, refreshFreezeData } from '@/api/control/index'
  import { findBoxByMac, configAndOperate, restoreFactorySetting, detailsthirdDevice, paramthirdDevice, setParamthirdDevice, cartInfo, rebootthirdDevice, resetthirdDevice } from '@/api/public'
  import { getConfigDataThirdDevice } from '@/api/console/device'
  import Signal from '@/pages/console/device/signal/index.vue'
  import ThreeDeviceModal from './ThreeDeviceModal.vue'
  import { processGroup } from './meshConf.js'

  export default {
    name: 'BaseInfo',
    props: {
      mac: { type: String },
      isHalf: { type: Boolean },
      infoData: {
        type: Object,
        default: () => {},
      },
    },
    components: { DeviceAdress, Signal, ThreeDeviceModal },
    data() {
      return {
        simList: [40, 41, 42], // 展示sim卡信息的设备equipmentType
        softVersionList: [33, 39, 40], // 展示软件版本号的设备equipmentType
        hardVersionList: [33, 40, 43], // 展示硬件件版本号的设备equipmentType
        showVersion: [22, 26, 27, 25, 28, 29, 30, 33, 38, 39, 40, 42, 43], // 不展示版本号的设备equipmentType
        othersVersion: null,
        deviceGroup: ['k1Power', 'k1Gateway', 'k11p', 'k12p', 'k13p', 'k14p'],
        softVersion: '',
        airDisinfectorVesion: '',
        selectRestore: '1',
        restoreSettingModal: false,
        tooltipDevice: this.$t('tooltipDevice1'),
        toolTipText: this.$t('toolTipText2'),
        bpk: '',
        inputLoading: true,
        dueDate: '',
        totalGprs: '',
        useGprs: '',
        icCid: '',
        comboType: '',
        protocolType: '',
        protocolTypeArray: ['lorawan', 'lora mesh', 'rf mesh', 'nbiot', 'gprs_direct', 'zigbee', 'WeloraWan', 'onenet', 'mqtt', 'LC-6B11-J', '4G', 'PLC'],
        hardVersion: '',
        solfVersion: '',
        controlTypeStr: '',
        temreStoreValue: '',
        temLowValue: '',
        restoreLowValue: '',
        restoreHightValue: '',
        lowVlotValue: '',
        vulotValue: '',
        streetLightModal: false,
        isResetLoading: false,
        resetMdal: false,
        isButtonLoading: false,
        reStartTool: false,
        picShow: true,
        propmapValue: {},
        deviceFlag: false,
        iconFourShow: false,
        info: null,
        others: { imsi: '', iccid: '', expireDate: '', simUpdateDate: '' },
        formInline: {},
        expireDay: '',
        url: '',
        srcList: [''],
        timerID: null,
        flag: false,
        uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
        imgData: { name: 'imgFile', mac: '' },
        onlineStatus: '',
        onlineTime: '',
        input: '',
        aliasName: this.$store.state.aliasName,
        aliasFlag: false,
        aliasIndex: -1,
        linkman: '',
        linkmanFlag: false,
        linkmanIndex: -1,
        linkmanTel: '',
        linkmanTelFlag: false,
        linkmanTelIndex: -1,
        linkman2: '',
        linkman2Flag: false,
        linkman2Index: -1,
        linkmanTel2: '',
        linkmanTel2Flag: false,
        linkmanTel2Index: -1,
        imgUrls: '',
        addressLight: '',
        customAlarmFlag: false,
        customAlarmName: '',
        classifyLabelFlag: false,
        classifyLabel: '',
      }
    },
    created() {
      this.getDeviceAdres()
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      handlechtqdqwaterRead() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: '<div>' + this.$t('surePerformMeterReading') + '？</div>',
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await refreshFreezeData({ mac: this.mac })
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      click3D() {
        if (this.deviceGroup.length) {
          this.$refs.threeDeviceModal.open()
        } else {
          this.$Message.error({ content: this.$t('deviceCurrentlyNot3DModel') })
        }
      },
      async handleCommand(type) {
        const res = await controlSwitch({ projectCode: this.$store.state.projectCode, mac: this.mac, oc: type })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.$Message.success(this.$t('theInstructionHasBeenIssuedAndIsCurrentlyInEffect'))
      },
      hideLinkman2() {
        this.linkman2Flag = false
        this.linkman2 = this.info.linkman2
      },
      hideLinkmanTel2() {
        this.linkmanTel2Flag = false
        this.linkmanTel2 = this.info.linkmanTel2
      },
      hideLinkmanTel() {
        this.linkmanTelFlag = false
        this.linkmanTel = this.info.linkmanTel
      },
      hideLinkMan() {
        this.linkmanFlag = false
        this.linkman = this.info.linkman
      },
      openRestoreDeveice() {
        this.restoreSettingModal = true
      },
      saveReStoreSetting() {
        this.$refs.operationCheckAuth.openModal()
      },
      async saveSetReSore() {
        let params = { mac: this.mac, containPlatData: this.selectRestore === '2', nnos: 0 }
        const res = await restoreFactorySetting(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.$Message.success({ content: this.$t('commandForSuccess') })
        this.restoreSettingModal = false
      },
      async getThirdVersion() {
        const res = await getConfigDataThirdDevice({ mac: this.mac })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.airDisinfectorVesion = res.data.hardVersion
        this.softVersion = res.data.softVersion || res.data.software_version
        this.othersVersion = res.data.version
      },
      handlemute() {
        let params = { cmd: 'REMOTE_MUTE', macs: this.mac, nodeNo: '0' }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div>${this.$t('performNoiseReduction')}？</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await modifyBoxsChnlRemoteMute(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      handleCopy(val) {
        this.$Copy({ text: val })
      },
      async readyReLoads() {
        this.isButtonLoading = true
        const res = await rebootthirdDevice({ mac: this.mac, address: this.others.address })
        if (res.success) {
          this.isButtonLoading = false
          this.reStartTool = false
          this.$Message.success({ content: this.$t('restartSuccessful') })
        } else {
          this.reStartTool = false
          this.$Message.error({ content: this.$t('gridOffline') })
        }
      },
      async readyReStart() {
        this.isResetLoading = true
        const res = await resetthirdDevice({ mac: this.mac, address: this.others.address })
        if (res.success) {
          this.isResetLoading = false
          this.resetMdal = false
          this.$Message.success({ content: this.$t('deviceParametersRestoredInitialState') })
        } else {
          this.resetMdal = false
          this.$Message.error({ content: this.$t('issuingCommandTimedOutTryAgainLater') })
        }
      },
      async saveLightConfig() {
        let param = {
          mac: this.mac,
          gridOverVolt: this.vulotValue,
          gridOverVoltReturn: this.restoreHightValue,
          gridLowVolt: this.lowVlotValue,
          gridLowVoltReturn: this.restoreLowValue,
          ledOverTemper: this.temLowValue,
          ledOverTemperReturn: this.temreStoreValue,
        }
        const res = await setParamthirdDevice(param)
        if (res.success) {
          this.streetLightModal = false
          this.$Message.success({ content: this.$t('savedSuccessfully') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async openStreetModal() {
        this.streetLightModal = true
        this.inputLoading = true
        let param = { mac: this.mac }
        const res = await paramthirdDevice(param)
        if (res.success) {
          this.inputLoading = false
          this.vulotValue = res.data.data.grid_over_volt
          this.restoreHightValue = res.data.data.grid_over_volt_return
          this.lowVlotValue = res.data.data.grid_low_volt
          this.restoreLowValue = res.data.data.grid_low_volt_return
          this.temLowValue = res.data.data.led_over_temper
          this.temreStoreValue = res.data.data.led_over_temper_return
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getDeviceDetails() {
        let param = { mac: this.mac }
        const res = await detailsthirdDevice(param)
        if (res.success) {
          this.controlTypeStr = res.data.controlTypeStr
          this.solfVersion = res.data.solf_version
          this.hardVersion = res.data.hard_version
          this.protocolType = res.data.protocolType
          this.icCid = res.data.iccid
        } else {
          this.$Message.error({ content: res.message })
        }
        this.getCarInfo()
      },
      async getCarInfo(val) {
        let param = { mac: this.mac }
        const res = await cartInfo(param)
        if (res.success) {
          this.msisdn = res.data.msisdn
          this.comboType = res.data.comboType
          this.useGprs = res.data.useGprs
          this.totalGprs = res.data.totalGprs
          this.dueDate = res.data.dueDate
          if (val === 'refresh') {
            this.$Message.success({ content: this.$t('refreshSuccessful') })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      openResetModal() {
        this.resetMdal = true
        this.isResetLoading = false
      },
      openRestart() {
        this.reStartTool = true
        this.isButtonLoading = false
      },
      async queryconfigAndOperate(type) {
        let list = [{ type: type, value: 0 }]
        let params = { deviceId: this.mac, list: JSON.stringify(list) }
        const res = await configAndOperate(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleairmode(type) {
        if (this.$store.state.airmode === 1) {
          this.$Modal.confirm({
            render: h => {
              return h('div', {}, [[h('Icon', { props: { custom: 'icon-v5 icon-v5-weiwancheng' }, style: { fontSize: '20px', color: 'red', marginRight: '10px' } }), h('span', { style: { fontSize: '16px' } }, this.$t('currentlyAutomaticModeRemoteControlCommandInvalidConfirmIssuance'))]])
            },
            onOk: () => {
              if (type === 'hot') {
                this.queryconfigAndOperate('sendCmdChn22')
              } else if (type === 'cold') {
                this.queryconfigAndOperate('sendCmdChn21')
              } else {
                this.queryconfigAndOperate('sendCmdChn23')
              }
            },
          })
        } else {
          if (type === 'hot') {
            this.queryconfigAndOperate('sendCmdChn22')
          } else if (type === 'cold') {
            this.queryconfigAndOperate('sendCmdChn21')
          } else {
            this.queryconfigAndOperate('sendCmdChn23')
          }
        }
      },
      init() {
        this.queryInfo()
        this.queryStatus()
      },
      async queryInfo() {
        this.picShow = true
        const res = await queryBoxDetails({ mac: this.mac })
        if (res.success) {
          setTimeout(() => {
            this.picShow = false
          }, 1000)
          this.info = res.data
          const { equipmentType, model, imgUrl, others, linkman, linkmanTel, linkman2, linkmanTel2, mac, name, room, unit, build } = res.data
          this.linkman = linkman
          this.linkmanTel = linkmanTel
          this.linkman2 = linkman2
          this.linkmanTel2 = linkmanTel2
          this.imgData.mac = mac
          this.aliasName = name
          this.customAlarmName = others.customAlarm
          this.classifyLabel = others.classifyLabel
          this.deviceGroup = processGroup(others.addrGroup)

          store.commit('adressLight', others.address)
          store.commit('aliasName', name)
          store.commit('customAlarm', others.customAlarm)
          store.commit('classifyLabel', others.classifyLabel)
          store.commit('sortBUR', { build, unit, room, linkman, linkman2, linkmanTel, linkmanTel2 })
          this.others = {
            imsi: others.imsi,
            iccid: others.iccid,
            expireDate: others.expireDate,
            simUpdateDate: others.simUpdateDate,
            address: others.address,
            version: others.version,
            manufacturer: others.manufacturer,
            online: others.online,
            volumePackage: others.volumePackage,
            remainVolume: others.remainVolume,
            supplierName: others.supplierName,
            netPort: others.netPort,
            csq: others.csq,
          }
          store.commit('simObj', others)
          const DefultNothigImg = require('@/assets/images/noimg.jpg')
          if (equipmentType === 1 || equipmentType === 19) {
            if (model === 'MT-X5' || !model) {
              this.url = imgUrl || DefultNothigImg
              this.srcList = [imgUrl || DefultNothigImg]
            }
          } else if (equipmentType === 10) {
            this.url = imgUrl || this.others.online === 1 ? require('@/assets/images/zac-online.png') : require('@/assets/images/zac-offline.png') // '/static/img/zac-online.png'
            this.srcList = [imgUrl || this.others.online === 1 ? require('@/assets/images/zac-online.png') : require('@/assets/images/zac-offline.png')]
          } else if (equipmentType === 13) {
            this.url = imgUrl || this.others.online === 1 ? require('@/assets/images/zac-gas-online.png') : require('@/assets/images/zac-gas-offline.png') // '/static/img/zac-gas-online.png'
            this.srcList = [imgUrl || this.others.online === 1 ? require('@/assets/images/zac-gas-online.png') : require('@/assets/images/zac-gas-offline.png')]
          } else if (equipmentType === 21) {
            this.url = imgUrl || require('@/assets/images/renke-air-offline.png') // '/static/img/renke-air-offline.png'
            this.srcList = [imgUrl || require('@/assets/images/renke-air-offline.png')]
          } else if (equipmentType === 22) {
            this.url = imgUrl || require('@/assets/images/WEconsG3001.png') // '/static/img/renke-air-offline.png'
            this.srcList = [imgUrl || require('@/assets/images/WEconsG3001.png')]
            this.getDeviceDetails()
          } else {
            this.url = imgUrl || DefultNothigImg
            this.srcList = [imgUrl || DefultNothigImg]
            if ([33, 38, 39, 40].includes(equipmentType)) this.getThirdVersion()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeFlag() {
        this.deviceFlag = false
        this.getDeviceAdres()
        this.init()
      },
      async getDeviceAdres() {
        let params = { mac: this.mac }
        const res = await findBoxByMac(params)
        if (res.success) {
          this.propmapValue = res.data
        }
      },
      hideAliasName() {
        this.aliasFlag = false
        this.aliasName = this.$store.state.aliasName
      },
      hideCustomAlarmFlag() {
        this.customAlarmFlag = false
        this.customAlarmName = this.$store.state.customAlarm
      },
      hideClassifyLabelFlag() {
        this.classifyLabelFlag = false
        this.classifyLabel = this.$store.state.classifyLabel
      },
      editDeviceModal() {
        this.deviceFlag = true
      },
      async queryStatus() {
        let params = { mac: this.mac }
        const res = await checkMacOnlineStatus(params)
        if (res.success) {
          this.onlineStatus = res.data.online
          this.onlineTime = res.data.onlineTime
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error({ content: this.$t('exceedSize') })
        }
        return isLt1M
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.queryInfo()
          this.queryStatus()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleInfo(mac, value, type) {
        let params = { mac: mac }
        if ((type === 'linkmanTel' || type === 'linkmanTel2') && !this.$func.checkPhone(value)) {
          return this.$Message.error({ content: this.$t('numberFormatError') })
        }
        params[type] = value
        const res = await macAlias(params)
        if (res.success) {
          this.$Message.success({ content: (type === 'name' ? this.$t('deviceAliases') : '') + this.$t('modifySuccess') + '！' })
          if (type === 'name') {
            store.commit('aliasName', value)
            this.aliasFlag = false
          } else if (type === 'linkman') {
            this.info.linkman = value
            this.linkmanFlag = false
          } else if (type === 'linkmanTel') {
            this.info.linkmanTel = value
            this.linkmanTelFlag = false
          } else if (type === 'linkman2') {
            this.info.linkman2 = value
            this.linkman2Flag = false
          } else if (type === 'linkmanTel2') {
            this.info.linkmanTel2 = value
            this.linkmanTel2Flag = false
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async simRefresh() {
        try {
          let params = { mac: this.mac, imsi: this.others.imsi ? this.others.imsi : '' }
          const res = await refreshSim(params)
          if (res.success) {
            if (res.data) {
              this.others = {
                ...this.others,
                imsi: res.data.imsi,
                iccid: res.data.iccid,
                expireDate: res.data.expireDate,
                simUpdateDate: res.data.simUpdateData,
                volumePackage: res.data.volumePackage,
                remainVolume: res.data.remainVolume,
                supplierName: res.data.supplierName,
              }
            }
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        } catch (error) {
          this.$Message.error({ content: this.$t('refreshFailed') })
        }
      },
      async handleCustomAlarm() {
        let params = { mac: this.mac, property: 'CUSTOM_ALARM', value: this.customAlarmName }
        const res = await saveBoxProperty(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('modifySuccess') })
          this.queryInfo()
          this.hideCustomAlarmFlag()
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      async handleClassifyLabel() {
        let params = { mac: this.mac, property: 'CLASSIFY_LABEL', value: this.classifyLabel }
        const res = await saveBoxProperty(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('classIdentificationLabel') })
          this.queryInfo()
          this.hideClassifyLabelFlag()
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
    },
    destroyed() {
      clearTimeout(this.timerID)
    },
    watch: {
      $route(to, from) {
        if (from.path === '/ConfigurationList') this.queryInfo()
      },
      infoData: {
        handler(val) {
          if (val && val.equipmentType === 43) {
            this.airDisinfectorVesion = val.hwVer
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less">
  .info-view {
    .ivu-form-item {
      margin-bottom: 0px;
    }
    .ivu-form-item-label {
      color: #8e9095 !important;
    }
    .text-rights {
      text-align: right !important;
      flex: 1;
      color: #999999 !important;
    }
    .bor-bottom {
      border-bottom: 1px solid #474c57;
      padding-bottom: 10px;
      margin-bottom: 35px;
      display: flex;
      padding-top: 10px;
      font-size: 16px;
    }
    .blue-right {
      width: 2px;
      height: 14px;
      margin-top: 5px;
      margin-right: 10px;
      background: #007eff;
    }
    .gray-buttons {
      background: rgba(153, 153, 153, 0.1);
      border: 1px solid #999999;
      color: #dddddd !important;
    }
    .warn-buttons {
      color: #ff9900 !important;
      border: 1px solid #ff9900 !important;
      background: rgba(55, 43, 39, 0.3);
    }
    .blue-buttons {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      padding: 0;
    }
    .theader {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      border-bottom: 1px solid #5e626c;
      .right {
        .aircdBtn {
          Button {
            margin: 0 5px;
            border-radius: 5px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            padding: 0 10px;
            position: relative;
          }
          .hot {
            background: rgba(242, 78, 76, 0.1);
            border: 1px solid #f24e4c;
            color: #f24e4c !important;
          }
          .cold {
            background: rgba(0, 126, 255, 0.1);
            border: 1px solid #007eff;
            color: #007eff !important;
          }
          .shutdown {
            background: rgba(153, 153, 153, 0.1);
            border: 1px solid #999999;
            color: #dddddd !important;
          }
        }
      }
    }
    .content {
      padding: 20px 10px;
      display: flex;
      .avat-image {
        width: 140px;
        height: auto;
        margin-right: 10px;
        position: relative;
        cursor: pointer;
        .three-icon {
          position: absolute;
          bottom: 4px;
          right: 4px;
          z-index: 1;
          color: #007eff;
        }
      }
      .rowH {
        width: calc(~'100% - 150px');
      }
      .title {
        border: 1px solid #fff;
        padding: 4px 16px;
      }
      .avat {
        width: 140px;
        position: relative;
        span {
          width: 32px;
        }
        .pa {
          position: absolute;
          right: 0px;
          font-size: 12px;
          font-family: PingFang SC;
          padding: 2px 4px;
          margin: 5px;
        }
        .bg1 {
          background: rgba(14, 209, 101, 0.3);
        }
        .bg2 {
          background: rgba(242, 78, 76, 0.3);
        }
        .bg3 {
          background: rgba(153, 153, 153, 0.3);
        }
        .device-signal {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .detail {
        padding-bottom: 20px;
        width: 100%;
        display: flex;
        .dev-position {
          width: 100%;
          display: flex;
          .text-val {
            max-width: calc(~'100% - 70px');
            flex-shrink: 0;
          }
          .icon-right {
            flex-shrink: 0;
            padding: 0px;
            padding-left: 5px;
            color: #007eff;
            display: none;
          }
          &:hover {
            .icon-right {
              display: inline-block;
            }
          }
        }
        .devic {
          .op-icon {
            display: none;
            margin-left: 5px;
            color: #007eff;
          }
          .op-icon.active {
            display: inline-block;
          }
          &:hover {
            .op-icon {
              display: inline-block;
            }
          }
        }
        .c9 {
          white-space: nowrap;
          flex-shrink: 0;
          margin-right: 5px;
        }
        .num {
          width: 100%;
          color: #fff;
          overflow: hidden;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .theader .right {
    /deep/.no-permission {
      color: #909399;
      border-color: #909399;
      &:hover {
        background: none;
      }
    }
  }
</style>
